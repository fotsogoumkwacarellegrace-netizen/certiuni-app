import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CertificateStatus } from '@prisma/client';
import { UploadBatchDto, BatchType } from './dto/upload-batch.dto';
import * as xlsx from 'xlsx';
import { generateSha256 } from '../../common/utils/crypto.util';
import { createSignedCertificateVerificationUrl } from '../../common/utils/qr-signature.util';
import { addPdfJobToQueue } from '../../jobs/queues/pdf.queue';

export interface BatchItemResult {
    rowNumber: number;
    data: Record<string, any>;
    isValid: boolean;
    errors?: string[];
    certificateId?: string;
    publicIdentifier?: string;
}

interface DiplomaRow {
    studentMatricule: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    diplomaTitle: string;
    fieldOfStudy: string;
    grade?: string;
    issueDate: string;
}

@Injectable()
export class BatchService {
    private readonly logger = new Logger(BatchService.name);

    constructor(private readonly prisma: PrismaService) { }

    async processBatchUpload(
        file: Express.Multer.File,
        dto: UploadBatchDto,
        userId: string,
    ) {
        if (!file) {
            throw new BadRequestException('Aucun fichier fourni pour l\'importation.');
        }

        // 1. Parsing du fichier Excel / CSV
        let rows: Record<string, any>[] = [];
        try {
            const workbook = xlsx.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
            if (dto.batchType === BatchType.DIPLOMAS_IMPORT) {
                rows = rows.map((row) => ({
                    ...row,
                    issueDate: this.normalizeIssueDate(row.issueDate),
                }));
            }
        } catch (error: any) {
            throw new BadRequestException(`Erreur lors de la lecture du fichier : ${error.message}`);
        }

        if (rows.length === 0) {
            throw new BadRequestException('Le fichier d\'importation est vide.');
        }

        // 2. Validation ligne par ligne selon le BatchType
        const results: BatchItemResult[] = [];
        let validCount = 0;
        let invalidCount = 0;

        for (let index = 0; index < rows.length; index++) {
            const rowData = rows[index];
            const rowErrors = this.validateRow(rowData, dto.batchType);

            const isValid = rowErrors.length === 0;
            if (isValid) validCount++;
            else invalidCount++;

            results.push({
                rowNumber: index + 2, // Compte tenu de la ligne d'en-tête (Header)
                data: rowData,
                isValid,
                ...(rowErrors.length > 0 && { errors: rowErrors }),
            });
        }

        // 3. Persistance des lignes valides (DIPLOMAS_IMPORT) — création des certificats + notarisation
        const createdCertificates: Array<{ rowNumber: number; id: string; publicIdentifier: string }> = [];

        if (dto.batchType === BatchType.DIPLOMAS_IMPORT) {
            const university = await this.prisma.university.findUnique({
                where: { id: dto.institutionId },
                select: { name: true, logoUrl: true },
            });
            if (!university) {
                throw new BadRequestException('L\'institution cible est introuvable.');
            }

            for (const item of results.filter((r) => r.isValid)) {
                const row = item.data as DiplomaRow;

                const canonicalHash = generateSha256({
                    studentIdentifier: row.studentMatricule,
                    degreeTitle: row.diplomaTitle,
                    issueDate: row.issueDate,
                    universityId: dto.institutionId,
                });

                const existing = await this.prisma.certificate.findUnique({
                    where: { canonicalHash },
                });
                if (existing) {
                    item.isValid = false;
                    item.errors = ['Un diplôme avec ces données existe déjà (empreinte SHA-256 dupliquée).'];
                    validCount--;
                    invalidCount++;
                    continue;
                }

                const publicIdentifier = `CERT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
                const verificationUrl = createSignedCertificateVerificationUrl(publicIdentifier);

                try {
                    const certificate = await this.prisma.certificate.create({
                        data: {
                            publicIdentifier,
                            canonicalHash,
                            studentIdentifier: row.studentMatricule,
                            studentFirstName: row.studentFirstName,
                            studentLastName: row.studentLastName,
                            studentEmail: row.studentEmail,
                            degreeTitle: row.diplomaTitle,
                            fieldOfStudy: row.fieldOfStudy,
                            grade: row.grade || null,
                            issueDate: new Date(row.issueDate),
                            status: CertificateStatus.PENDING,
                            universityId: dto.institutionId,
                            issuedById: userId,
                        },
                    });

                    await addPdfJobToQueue({
                        certificateId: certificate.id,
                        publicIdentifier,
                        studentName: `${row.studentFirstName} ${row.studentLastName}`,
                        degreeTitle: row.diplomaTitle,
                        fieldOfStudy: row.fieldOfStudy,
                        grade: row.grade || undefined,
                        issueDate: row.issueDate,
                        universityName: university.name,
                        universityLogoUrl: university.logoUrl || undefined,
                        canonicalHash,
                        verificationUrl,
                        documentNumber: publicIdentifier,
                        universityId: dto.institutionId,
                    });

                    item.certificateId = certificate.id;
                    item.publicIdentifier = publicIdentifier;
                    createdCertificates.push({
                        rowNumber: item.rowNumber,
                        id: certificate.id,
                        publicIdentifier,
                    });
                } catch (error: any) {
                    item.isValid = false;
                    item.errors = [`Erreur lors de l'enregistrement en base de données : ${error.message}`];
                    validCount--;
                    invalidCount++;
                }
            }
        }

        this.logger.log(
            `[Batch] Lot ${dto.batchType} traité par l'utilisateur #${userId}. Succès: ${validCount}, Échecs: ${invalidCount}`,
        );

        return {
            batchType: dto.batchType,
            institutionId: dto.institutionId,
            totalRows: rows.length,
            validRowsCount: validCount,
            invalidRowsCount: invalidCount,
            createdCertificates,
            details: results,
        };
    }

    private validateRow(data: Record<string, any>, batchType: BatchType): string[] {
        const errors: string[] = [];

        if (batchType === BatchType.STUDENTS_IMPORT) {
            if (!data['matricule'] || String(data['matricule']).trim() === '') {
                errors.push('Le matricule est obligatoire.');
            }
            if (!data['firstName'] || String(data['firstName']).trim() === '') {
                errors.push('Le prénom est obligatoire.');
            }
            if (!data['lastName'] || String(data['lastName']).trim() === '') {
                errors.push('Le nom est obligatoire.');
            }
            if (!data['email'] || !String(data['email']).includes('@')) {
                errors.push('L\'adresse e-mail est absente ou invalide.');
            }
        } else if (batchType === BatchType.DIPLOMAS_IMPORT) {
            if (!data['studentMatricule'] || String(data['studentMatricule']).trim() === '') {
                errors.push('Le matricule étudiant est obligatoire.');
            }
            if (!data['studentFirstName'] || String(data['studentFirstName']).trim() === '') {
                errors.push('Le prénom étudiant est obligatoire.');
            }
            if (!data['studentLastName'] || String(data['studentLastName']).trim() === '') {
                errors.push('Le nom étudiant est obligatoire.');
            }
            if (!data['studentEmail'] || !String(data['studentEmail']).includes('@')) {
                errors.push('L\'adresse e-mail de l\'étudiant est absente ou invalide.');
            }
            if (!data['diplomaTitle'] || String(data['diplomaTitle']).trim() === '') {
                errors.push('Le titre du diplôme est obligatoire.');
            }
            if (!data['fieldOfStudy'] || String(data['fieldOfStudy']).trim() === '') {
                errors.push('La filière d\'études est obligatoire.');
            }
            if (!data['issueDate']) {
                errors.push('La date de délivrance est obligatoire.');
            }
        }

        return errors;
    }

    private normalizeIssueDate(value: unknown): string {
        let date: Date;

        if (value instanceof Date) {
            date = value;
        } else if (typeof value === 'number' && Number.isFinite(value)) {
            date = new Date(Date.UTC(1899, 11, 30) + value * 24 * 60 * 60 * 1000);
        } else if (typeof value === 'string') {
            const trimmedValue = value.trim();
            if (!trimmedValue) {
                return '';
            }
            const numericValue = Number(trimmedValue);
            date = Number.isFinite(numericValue)
                ? new Date(Date.UTC(1899, 11, 30) + numericValue * 24 * 60 * 60 * 1000)
                : new Date(trimmedValue);
        } else {
            return '';
        }

        return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
    }
}