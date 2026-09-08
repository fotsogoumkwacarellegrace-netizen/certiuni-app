import { Router, Request, Response } from 'express';
// import prisma from '../server';
import { PrismaService } from '../prisma/prisma.service';

const router = Router();
const prisma = new PrismaService();
/**
 * GET /api/v1/public/verify/:identifier
 * Vérification publique et anonyme d'un diplôme par son identifiant public
 */
router.get('/verify/:identifier', async (req: Request, res: Response): Promise<void> => {
    try {
        const { identifier } = req.params;

        if (!identifier || typeof identifier !== 'string') {
            res.status(400).json({
                status: 'fail',
                message: "L'identifiant public du diplôme est requis.",
            });
            return;
        }

        // 1. Recherche du diplôme dans la base de données avec les détails de l'université
        const certificate = await prisma.document.findUnique({
            where: {
                publicIdentifier: identifier.trim().toUpperCase(),
            },
            select: {
                id: true,
                publicIdentifier: true,
                studentFirstName: true,
                studentLastName: true,
                degreeTitle: true,
                fieldOfStudy: true,
                grade: true,
                issueDate: true,
                canonicalHash: true,
                qrCodeDataUrl: true,
                status: true,
                revocationReason: true,
                revokedAt: true,
                createdAt: true,
                university: {
                    select: {
                        name: true,
                        code: true,
                        logoUrl: true,
                    },
                },
            },
        });

        // 2. Si le diplôme n'existe pas en base de données
        if (!certificate) {
            res.status(404).json({
                status: 'fail',
                verified: false,
                message: 'Aucun diplôme correspondant à cet identifiant n\'a été trouvé dans le registre officiel.',
            });
            return;
        }

        // 3. Détermination de la validité officielle
        const isValid = certificate.status === 'ISSUED';

        // 4. Renvoi des données publiques du certificat
        res.status(200).json({
            status: 'success',
            verified: isValid,
            certificate: {
                publicIdentifier: certificate.publicIdentifier,
                status: certificate.status,
                studentName: `${certificate.studentFirstName} ${certificate.studentLastName}`,
                studentFirstName: certificate.studentFirstName,
                studentLastName: certificate.studentLastName,
                degreeTitle: certificate.degreeTitle,
                fieldOfStudy: certificate.fieldOfStudy,
                grade: certificate.grade,
                issueDate: certificate.issueDate,
                canonicalHash: certificate.canonicalHash,
                qrCodeDataUrl: certificate.qrCodeDataUrl,
                universityName: certificate.university.name,
                universityCode: certificate.university.code,
                universityLogoUrl: certificate.university.logoUrl,
                // Informations complémentaires en cas de révocations
                revokedAt: certificate.revokedAt,
                revocationReason: isValid ? null : certificate.revocationReason,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la vérification publique du diplôme :', error);
        res.status(500).json({
            status: 'error',
            message: 'Une erreur interne est survenue lors du contrôle du diplôme.',
        });
    }
});

export default router;