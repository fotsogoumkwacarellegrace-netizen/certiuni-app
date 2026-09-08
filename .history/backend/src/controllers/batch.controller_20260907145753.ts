import { Request, Response } from 'express';
import { parse as parseCsv } from 'csv-parse/sync';
import * as xlsx from 'xlsx';
import { prisma } from '../config/database';
// import { catchAsync } from '../utils/catchAsync';
import { CryptoService } from '../services/crypto.service';
import { addPdfJobToQueue } from '../jobs/queues/pdf.queue';
import { AuditService, AuditAction } from '../services/audit.service';
import { IssueCertificateSchema } from '../dtos/certificate.dto';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors/app.error';

interface RawCertificateRow {
    studentIdentifier: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    degreeTitle: string;
    fieldOfStudy: string;
    grade?: string;
    issueDate: string;
}

/**
 * Lit et normalise les données du buffer selon l'extension du fichier
 */
const parseFileBuffer = (buffer: Buffer, originalName: string): RawCertificateRow[] => {
    if (originalName.endsWith('.csv')) {
        return parseCsv(buffer, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        }) as RawCertificateRow[];
    }

    // Traitement pour les fichiers Excel (.xlsx, .xls)
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    return xlsx.utils.sheet_to_json<RawCertificateRow>(worksheet, {
        raw: false, // Convertit les dates/nombres en chaînes de caractères
        defval: '',
    });
};

/**
 * Importation et émission en masse de diplômes
 */
export const importCertificatesBatch = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
        throw new BadRequestError('Veuillez fournir un fichier CSV ou Excel.');
    }

    const universityId = req.user?.universityId;
    if (!universityId) {
        throw new ForbiddenError('L\'utilisateur doit être rattaché à une université pour émettre des diplômes.');
    }

    const university = await prisma.university.findUnique({
        where: { id: universityId },
    });

    if (!university) {
        throw new NotFoundError('Université introuvable.');
    }

    // 1. Extraction et parsing du fichier
    let rawRows: RawCertificateRow[];
    try {
        rawRows = parseFileBuffer(req.file.buffer, req.file.originalname);
    } catch {
        throw new BadRequestError('Échec de la lecture du fichier. Assurez-vous que le format est valide.');
    }

    if (!rawRows || rawRows.length === 0) {
        throw new BadRequestError('Le fichier transmis est vide.');
    }

    if (rawRows.length > 500) {
        throw new BadRequestError('La taille maximale autorisée par lot est de 500 diplômes.');
    }

    const successfulImports: Array<{ id: string; publicIdentifier: string }> = [];
    const errors: Array<{ row: number; errors: string[] }> = [];

    // 2. Traitement ligne par ligne
    for (let index = 0; index < rawRows.length; index++) {
        const rowNum = index + 2; // Compte tenu de l'en-tête du fichier
        const row = rawRows[index];

        // Validation du schéma Zod pour chaque ligne
        const validation = IssueCertificateSchema.safeParse(row);

        if (!validation.success) {
            errors.push({
                row: rowNum,
                errors: validation.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
            });
            continue;
        }

        const validatedData = validation.data;

        // Calcul du Hash Canonique SHA-256
        const canonicalHash = CryptoService.calculateCanonicalHash({
            studentIdentifier: validatedData.studentIdentifier,
            degreeTitle: validatedData.degreeTitle,
            issueDate: validatedData.issueDate,
            universityId,
        });

        // Vérification de l'unicité
        const existingCert = await prisma.certificate.findUnique({
            where: { canonicalHash },
        });

        if (existingCert) {
            errors.push({
                row: rowNum,
                errors: [`Un diplôme avec cette empreinte existe déjà (${validatedData.studentIdentifier}).`],
            });
            continue;
        }

        const publicIdentifier = `CERT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const verificationUrl = `${process.env.FRONTEND_URL || 'https://certiuni.app'}/verify/${publicIdentifier}`;

        try {
            // Insertion BDD en transaction isolée par ligne
            const certificate = await prisma.certificate.create({
                data: {
                    publicIdentifier,
                    canonicalHash,
                    studentIdentifier: validatedData.studentIdentifier,
                    studentFirstName: validatedData.studentFirstName,
                    studentLastName: validatedData.studentLastName,
                    studentEmail: validatedData.studentEmail,
                    degreeTitle: validatedData.degreeTitle,
                    fieldOfStudy: validatedData.fieldOfStudy,
                    grade: validatedData.grade,
                    issueDate: new Date(validatedData.issueDate),
                    status: 'PENDING',
                    universityId,
                    issuedById: req.user!.id,
                },
            });

            // Dispatch dans la file BullMQ
            await addPdfJobToQueue({
                certificateId: certificate.id,
                publicIdentifier,
                studentName: `${validatedData.studentFirstName} ${validatedData.studentLastName}`,
                degreeTitle: validatedData.degreeTitle,
                fieldOfStudy: validatedData.fieldOfStudy,
                grade: validatedData.grade,
                issueDate: validatedData.issueDate,
                universityName: university.name,
                universityLogoUrl: university.logoUrl || undefined,
                canonicalHash,
                verificationUrl,
                documentNumber: certificate.documentNumber, // Add missing property
                universityId: certificate.universityId,     // Add missing property
            });

            successfulImports.push({ id: certificate.id, publicIdentifier });
        } catch {
            errors.push({
                row: rowNum,
                errors: ['Erreur lors de l\'enregistrement en base de données.'],
            });
        }
    }

    // 3. Log d'audit global pour le traitement du lot
    await AuditService.logAction({
        action: AuditAction.CERTIFICATE_ISSUED,
        userId: req.user!.id,
        universityId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: {
            batchFileName: req.file.originalname,
            totalRows: rawRows.length,
            successCount: successfulImports.length,
            errorCount: errors.length,
        },
    });

    // 4. Bilan d'exécution du traitement par lot
    res.status(207).json({
        status: 'multi_status',
        message: `Traitement terminé : ${successfulImports.length} diplômes importés avec succès, ${errors.length} échec(s).`,
        summary: {
            totalProcessed: rawRows.length,
            successCount: successfulImports.length,
            failedCount: errors.length,
        },
        data: {
            successfulImports,
            errors,
        },
    });
});