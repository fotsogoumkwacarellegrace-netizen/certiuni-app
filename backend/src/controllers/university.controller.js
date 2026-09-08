"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.updateUniversity = exports.getUniversityById = exports.getDashboard = void 0;
const openapi = require("@nestjs/swagger");
const database_1 = require("../config/database");
const catchAsync_1 = require("../common/utils/catchAsync");
const responseFormatter_1 = require("../common/utils/responseFormatter");
exports.getDashboard = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const universityId = req.user?.universityId;
    if (!universityId) {
        return (0, responseFormatter_1.sendErrorResponse)(res, 401, 'Université non identifiée');
    }
    const [certificateCount, verificationCount, revenue] = await Promise.all([
        database_1.prisma.certificate.count({ where: { universityId } }),
        database_1.prisma.verificationLog.count({ where: { universityId } }),
        database_1.prisma.payment.aggregate({
            where: { universityId },
            _sum: { amount: true },
        }),
    ]);
    return (0, responseFormatter_1.sendSuccessResponse)(res, 200, {
        university: req.user,
        statistics: {
            totalCertificates: certificateCount,
            totalVerifications: verificationCount,
            totalRevenue: revenue._sum.amount || 0,
            lastUpdated: new Date().toISOString(),
        },
    });
});
exports.getUniversityById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const university = await database_1.prisma.university.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            code: true,
            logoUrl: true,
            website: true,
            isVerified: true,
            createdAt: true,
        },
    });
    if (!university) {
        return (0, responseFormatter_1.sendErrorResponse)(res, 404, 'Université introuvable');
    }
    return (0, responseFormatter_1.sendSuccessResponse)(res, 200, university);
});
exports.updateUniversity = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const universityId = req.user?.universityId;
    const { name, logoUrl, website } = req.body;
    if (!universityId) {
        return (0, responseFormatter_1.sendErrorResponse)(res, 401, 'Université non identifiée');
    }
    const updated = await database_1.prisma.university.update({
        where: { id: universityId },
        data: {
            ...(name && { name }),
            ...(logoUrl && { logoUrl }),
            ...(website && { website }),
        },
    });
    return (0, responseFormatter_1.sendSuccessResponse)(res, 200, updated, 'Université mise à jour avec succès');
});
exports.getAuditLogs = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const universityId = req.user?.universityId;
    const { limit = 50, offset = 0 } = req.query;
    if (!universityId) {
        return (0, responseFormatter_1.sendErrorResponse)(res, 401, 'Université non identifiée');
    }
    const logs = await database_1.prisma.auditLog.findMany({
        where: { universityId },
        orderBy: { createdAt: 'desc' },
        take: Math.min(parseInt(limit) || 50, 100),
        skip: parseInt(offset) || 0,
        include: {
            user: { select: { id: true, email: true } },
        },
    });
    return (0, responseFormatter_1.sendSuccessResponse)(res, 200, logs);
});
//# sourceMappingURL=university.controller.js.map