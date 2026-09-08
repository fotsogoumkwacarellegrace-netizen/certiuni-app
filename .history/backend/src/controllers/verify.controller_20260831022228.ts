import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { catchAsync } from '../utils/catchAsync';
import { NotFoundError, BadRequestError } from '../errors/app.error';
import { AuditService, AuditAction } from '../services/audit.service';
import { getPresignedDownloadUrl } from '../services/storage.service';

/**
 * Vérifie l'authenticité d'un diplôme via son identifiant public (QR Code) ou son hash SHA-256
 */
export const verifyCertificate = catchAsync(async (req: Request, res: Response) => {
    const { identifier } = req.query as { identifier: string };

    if (!identifier) {
        throw new BadRequestError('L\'identifiant public ou l\'empreinte SHA-256 est requis pour la vérification.');
    }

    const cleanIdentifier = identifier.trim();

    // Recherche du diplôme par identifiant public OU par Hash canonique
    const certificate = await prisma.certificate.findFirst({
        where: {
            OR: [
                { publicIdentifier: cleanIdentifier },
                { canonicalHash: cleanIdentifier },
            ],
        },
        include: {
            university: {
                select: {
                    id: true,
                    name: true,
                    code: true,
                    logoUrl: true,
                    isVerified: true,
                },
            },
        },
    });

    // 1. Diplôme introuvable (Potentiel faux diplôme)
    if (!certificate) {
        throw new NotFoundError('Aucun diplôme authentique ne correspond à cet identifiant ou cette empreinte SHA-256.');
    }

    // Log d'audit pour la traçabilité de la consultation
    await AuditService.logAction({
        action: AuditAction.VERIFICATION_SUCCESS,
        universityId: certificate.universityId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: {
            certificateId: certificate.id,
            publicIdentifier: certificate.publicIdentifier,
            verificationStatus: certificate.status,
        },
    });

    // 2. Traitement d'un diplôme Révoqué
    if (certificate.status === 'REVOKED') {
        res.status(200).json({
            status: 'warning',
            isValid: false,
            message: 'Attention : Ce diplôme a été révoqué par l\'établissement émetteur.',
            data: {
                publicIdentifier: certificate.publicIdentifier,
                status: certificate.status,
                revokedAt: certificate.revokedAt,
                revocationReason: certificate.revocationReason,
                university: {
                    name: certificate.university.name,
                    code: certificate.university.code,
                },
            },
        });
        return;
    }

    // 3. Traitement d'un diplôme en cours de génération
    if (certificate.status === 'PENDING') {
        res.status(200).json({
            status: 'info',
            isValid: false,
            message: 'Le diplôme est authentique mais sa version PDF est en cours de traitement.',
            data: {
                publicIdentifier: certificate.publicIdentifier,
                status: certificate.status,
            },
        });
        return;
    }

    // 4. Génération d'une URL de téléchargement pré-signée S3 si le PDF existe
    let secureDownloadUrl: string | null = null;
    if (certificate.pdfKey) {
        secureDownloadUrl = await getPresignedDownloadUrl(certificate.pdfKey, 900); // Valide 15 minutes
    }

    // 5. Diplôme Valide & Authentique
    res.status(200).json({
        status: 'success',
        isValid: true,
        message: 'Diplôme authentique certifié par la plateforme CertiUni.',
        data: {
            publicIdentifier: certificate.publicIdentifier,
            canonicalHash: certificate.canonicalHash,
            status: certificate.status,
            studentInfo: {
                firstName: certificate.studentFirstName,
                lastName: certificate.studentLastName,
                identifierMasked: `${certificate.studentIdentifier.slice(0, 2)}***${certificate.studentIdentifier.slice(-2)}`,
            },
            degree: {
                title: certificate.degreeTitle,
                fieldOfStudy: certificate.fieldOfStudy,
                grade: certificate.grade,
                issueDate: certificate.issueDate,
            },
            university: {
                name: certificate.university.name,
                code: certificate.university.code,
                logoUrl: certificate.university.logoUrl,
                isVerified: certificate.university.isVerified,
            },
            pdfDownloadUrl: secureDownloadUrl,
        },
    });
});