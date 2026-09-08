import { Request, Response } from 'express';
import { prisma } from '../config/database';
// import { catchAsync } from '../utils/catchAsync';
import { CryptoService } from '../services/crypto.service';
import { addPdfJobToQueue } from '../jobs/queues/pdf.queue';
import { AuditService, AuditAction } from '../services/audit.service';
import { NotFoundError, BadRequestError, ForbiddenError } from '../errors/app.error';

/**
 * Émet un nouveau diplôme de manière asynchrone via BullMQ
 */
export const issueCertificate = async (req: Request, res: Response) => {
    const {
        studentIdentifier,
        studentFirstName,
        studentLastName,
        studentEmail,
        degreeTitle,
        fieldOfStudy,
        grade,
        issueDate,
    } = req.body;

    // Récupération du tenant (Université) rattaché à l'utilisateur connecté
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

    // 1. Calcul du Hash Canonique SHA-256
    const canonicalHash = CryptoService.calculateCanonicalHash({
        studentIdentifier,
        degreeTitle,
        issueDate,
        universityId,
    });

    // 2. Vérification de l'unicité du diplôme (prévention des doublons)
    const existingCert = await prisma.certificate.findUnique({
        where: { canonicalHash },
    });

    if (existingCert) {
        throw new BadRequestError('Un diplôme identique existe déjà avec ce hash canonique.');
    }

    // Identifiant public unique pour la vérification (ex: URL QR code)
    const publicIdentifier = `CERT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const verificationUrl = `${process.env.FRONTEND_URL || 'https://certiuni.app'}/verify/${publicIdentifier}`;

    // 3. Création de l'enregistrement en BDD au statut PENDING
    const certificate = await prisma.certificate.create({
        data: {
            publicIdentifier,
            canonicalHash,
            studentIdentifier,
            studentFirstName,
            studentLastName,
            studentEmail,
            degreeTitle,
            fieldOfStudy,
            grade,
            issueDate: new Date(issueDate),
            status: 'PENDING',
            universityId,
            issuedById: req.user!.id,
        },
    });

    // 4. Envoi du travail d'impression PDF dans la file d'attente BullMQ
    await addPdfJobToQueue({
        certificateId: certificate.id,
        publicIdentifier,
        studentName: `${studentFirstName} ${studentLastName}`,
        degreeTitle,
        fieldOfStudy,
        grade,
        issueDate,
        universityName: university.name,
        universityLogoUrl: university.logoUrl || undefined,
        canonicalHash,
        verificationUrl,
        // documentNumber: certificate.documentNumber,
        universityId: certificate.universityId,
    });

    // 5. Consignation dans les logs d'audit de sécurité
    await AuditService.logAction({
        action: AuditAction.CERTIFICATE_ISSUED,
        userId: req.user!.id,
        universityId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { certificateId: certificate.id, publicIdentifier },
    });

    res.status(202).json({
        status: 'success',
        message: 'Demande d\'émission de diplôme acceptée. Le PDF est en cours de génération.',
        data: {
            id: certificate.id,
            publicIdentifier,
            canonicalHash,
            status: certificate.status,
        },
    });
}),

/**
 * Récupère les détails d'un diplôme (accès restreint à l'université émettrice ou SuperAdmin)
 */
export const getCertificateById = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const certificate = await prisma.certificate.findUnique({
        where: { id },
        include: {
            university: { select: { name: true, code: true } },
            issuedBy: { select: { firstName: true, lastName: true, email: true } },
        },
    });

    if (!certificate) {
        throw new NotFoundError('Diplôme non trouvé.');
    }

    // Restriction Multi-Tenant
    if (req.user?.role !== 'SUPER_ADMIN' && certificate.universityId !== req.user?.universityId) {
        throw new ForbiddenError('Vous n\'avez pas la permission d\'accéder à ce diplôme.');
    }

    res.status(200).json({
        status: 'success',
        data: certificate,
    });
});

/**
 * Révoque un diplôme existant pour motif de fraude ou erreur d'attribution
 */
export const revokeCertificate = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { reason } = req.body;

    const certificate = await prisma.certificate.findUnique({
        where: { id },
    });

    if (!certificate) {
        throw new NotFoundError('Diplôme introuvable.');
    }

    if (req.user?.role !== 'SUPER_ADMIN' && certificate.universityId !== req.user?.universityId) {
        throw new ForbiddenError('Action non autorisée sur les diplômes d\'un autre établissement.');
    }

    if (certificate.status === 'REVOKED') {
        throw new BadRequestError('Ce diplôme a déjà été révoqué.');
    }

    const updatedCertificate = await prisma.certificate.update({
        where: { id },
        data: {
            status: 'REVOKED',
            revocationReason: reason,
            revokedAt: new Date(),
        },
    });

    await AuditService.logAction({
        action: AuditAction.CERTIFICATE_REVOKED,
        userId: req.user!.id,
        universityId: certificate.universityId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { certificateId: id, reason },
    });

    res.status(200).json({
        status: 'success',
        message: 'Le diplôme a été révoqué avec succès.',
        data: updatedCertificate,
    });
});