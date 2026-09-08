"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCertificate = void 0;
const openapi = require("@nestjs/swagger");
const database_1 = require("../config/database");
const catchAsync_1 = require("../common/utils/catchAsync");
const app_error_1 = require("../errors/app.error");
exports.verifyCertificate = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { identifier } = req.query;
    if (!identifier || !identifier.trim()) {
        throw new app_error_1.BadRequestError('L\'identifiant public ou l\'empreinte SHA-256 est requis.');
    }
    const cleanIdentifier = identifier.trim();
    const certificate = await database_1.prisma.certificate.findFirst({
        where: {
            OR: [{ publicIdentifier: cleanIdentifier }, { canonicalHash: cleanIdentifier }],
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
    if (!certificate) {
        throw new app_error_1.NotFoundError('Aucun diplôme authentique ne correspond à cet identifiant ou cette empreinte SHA-256.');
    }
    if (certificate.status === 'REVOKED') {
        res.status(200).json({
            status: 'warning',
            isValid: false,
            message: 'Ce diplôme a été révoqué par l\'établissement émetteur.',
            data: {
                publicIdentifier: certificate.publicIdentifier,
                status: certificate.status,
                revokedAt: certificate.revokedAt,
                revocationReason: certificate.revocationReason,
            },
        });
        return;
    }
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
            pdfDownloadUrl: certificate.pdfUrl ?? null,
        },
    });
});
//# sourceMappingURL=verify.controller.js.map