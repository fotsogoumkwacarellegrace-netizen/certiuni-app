"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/verify/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        if (!identifier || typeof identifier !== 'string') {
            res.status(400).json({
                status: 'fail',
                message: "L'identifiant public du diplôme est requis.",
            });
            return;
        }
        const certificate = await prisma.certificate.findUnique({
            where: {
                publicIdentifier: identifier.trim(),
            },
            include: {
                university: {
                    select: {
                        name: true,
                        code: true,
                        logoUrl: true,
                    },
                },
            },
        });
        if (!certificate) {
            res.status(404).json({
                status: 'fail',
                verified: false,
                message: 'Aucun diplôme correspondant à cet identifiant n\'a été trouvé dans le registre officiel.',
            });
            return;
        }
        const isValid = certificate.status === 'ISSUED';
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
                universityName: certificate.university.name,
                universityCode: certificate.university.code,
                universityLogoUrl: certificate.university.logoUrl,
                revokedAt: certificate.revokedAt,
                revocationReason: isValid ? null : certificate.revocationReason,
            },
        });
    }
    catch (error) {
        console.error('Erreur lors de la vérification publique du diplôme :', error);
        res.status(500).json({
            status: 'error',
            message: 'Une erreur interne est survenue lors du contrôle du diplôme.',
        });
    }
});
exports.default = router;
//# sourceMappingURL=public-verify.router.js.map