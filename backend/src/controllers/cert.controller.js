"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeCertificate = exports.getCertificateById = exports.issueCertificate = void 0;
const openapi = require("@nestjs/swagger");
const database_1 = require("../config/database");
const crypto_service_1 = require("../services/crypto.service");
const pdf_queue_1 = require("../jobs/queues/pdf.queue");
const audit_service_1 = require("../services/audit.service");
const app_error_1 = require("../errors/app.error");
const issueCertificate = async (req, res) => {
    const { studentIdentifier, studentFirstName, studentLastName, studentEmail, degreeTitle, fieldOfStudy, grade, issueDate, } = req.body;
    const universityId = req.user?.universityId;
    if (!universityId) {
        throw new app_error_1.ForbiddenError('L\'utilisateur doit être rattaché à une université pour émettre des diplômes.');
    }
    const university = await database_1.prisma.university.findUnique({
        where: { id: universityId },
    });
    if (!university) {
        throw new app_error_1.NotFoundError('Université introuvable.');
    }
    const canonicalHash = crypto_service_1.CryptoService.calculateCanonicalHash({
        studentIdentifier,
        degreeTitle,
        issueDate,
        universityId,
    });
    const existingCert = await database_1.prisma.certificate.findUnique({
        where: { canonicalHash },
    });
    if (existingCert) {
        throw new app_error_1.BadRequestError('Un diplôme identique existe déjà avec ce hash canonique.');
    }
    const publicIdentifier = `CERT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const verificationUrl = `${process.env.FRONTEND_URL || 'https://certiuni.app'}/verify/${publicIdentifier}`;
    const certificate = await database_1.prisma.certificate.create({
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
            issuedById: req.user.id,
        },
    });
    await (0, pdf_queue_1.addPdfJobToQueue)({
        certificateId: certificate.id,
        publicIdentifier,
        documentNumber: publicIdentifier,
        studentName: `${studentFirstName} ${studentLastName}`,
        degreeTitle,
        fieldOfStudy,
        grade,
        issueDate,
        universityName: university.name,
        universityLogoUrl: university.logoUrl || undefined,
        canonicalHash,
        verificationUrl,
        universityId: certificate.universityId,
    });
    await audit_service_1.AuditService.logAction({
        action: audit_service_1.AuditAction.CERTIFICATE_ISSUED,
        userId: req.user.id,
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
};
exports.issueCertificate = issueCertificate;
const getCertificateById = async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const certificate = await database_1.prisma.certificate.findUnique({
        where: { id },
        include: {
            university: { select: { name: true, code: true } },
            issuedBy: { select: { firstName: true, lastName: true, email: true } },
        },
    });
    if (!certificate) {
        throw new app_error_1.NotFoundError('Diplôme non trouvé.');
    }
    if (req.user?.role !== 'SUPER_ADMIN' && certificate.universityId !== req.user?.universityId) {
        throw new app_error_1.ForbiddenError('Vous n\'avez pas la permission d\'accéder à ce diplôme.');
    }
    res.status(200).json({
        status: 'success',
        data: certificate,
    });
};
exports.getCertificateById = getCertificateById;
const revokeCertificate = async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { reason } = req.body;
    const certificate = await database_1.prisma.certificate.findUnique({
        where: { id },
    });
    if (!certificate) {
        throw new app_error_1.NotFoundError('Diplôme introuvable.');
    }
    if (req.user?.role !== 'SUPER_ADMIN' && certificate.universityId !== req.user?.universityId) {
        throw new app_error_1.ForbiddenError('Action non autorisée sur les diplômes d\'un autre établissement.');
    }
    if (certificate.status === 'REVOKED') {
        throw new app_error_1.BadRequestError('Ce diplôme a déjà été révoqué.');
    }
    const updatedCertificate = await database_1.prisma.certificate.update({
        where: { id },
        data: {
            status: 'REVOKED',
            revocationReason: reason,
            revokedAt: new Date(),
        },
    });
    await audit_service_1.AuditService.logAction({
        action: audit_service_1.AuditAction.CERTIFICATE_REVOKED,
        userId: req.user.id,
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
};
exports.revokeCertificate = revokeCertificate;
//# sourceMappingURL=cert.controller.js.map