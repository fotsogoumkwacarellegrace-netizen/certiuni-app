"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockIpAddress = exports.getSuspiciousLogs = exports.reportSuspiciousActivity = void 0;
const openapi = require("@nestjs/swagger");
const database_1 = require("../config/database");
const notification_service_1 = require("../services/notification.service");
const logger = { log: console.log, error: console.error, warn: console.warn };
const reportSuspiciousActivity = async (req, res) => {
    const { certificateId, reason, ipAddress, userAgent } = req.body;
    if (!certificateId || !reason) {
        return res.status(400).json({ status: 'error', message: 'Certificat et motif requis' });
    }
    try {
        const alert = await database_1.prisma.auditLog.create({
            data: {
                action: 'FRAUD_ALERT',
                reason,
                metadata: {
                    certificateId,
                    reportedAt: new Date().toISOString(),
                    ipAddress,
                    userAgent,
                },
                ipAddress: ipAddress || 'UNKNOWN',
                userAgent: userAgent || 'UNKNOWN',
            },
        });
        const universities = await database_1.prisma.university.findMany({
            select: { id: true },
        });
        for (const uni of universities) {
            await notification_service_1.notificationService.notifySecurityAlert(uni.id, `Activité suspecte détectée: ${reason}`);
        }
        logger.warn('Fraud alert triggered', { certificateId, reason });
        return res.status(201).json({
            status: 'success',
            alertId: alert.id,
            message: 'reported',
        });
    }
    catch (error) {
        logger.error('Failed to report suspicious activity', { error });
        return res.status(500).json({ status: 'error', message: 'Erreur lors du rapport' });
    }
};
exports.reportSuspiciousActivity = reportSuspiciousActivity;
const getSuspiciousLogs = async (req, res) => {
    const { limit = 50, offset = 0 } = req.query;
    try {
        const logs = await database_1.prisma.auditLog.findMany({
            where: { action: 'FRAUD_ALERT' },
            orderBy: { createdAt: 'desc' },
            take: Math.min(parseInt(limit) || 50, 100),
            skip: parseInt(offset) || 0,
        });
        return res.status(200).json({ status: 'success', data: logs });
    }
    catch (error) {
        logger.error('Failed to fetch suspicious logs', { error });
        return res.status(500).json({ status: 'error', message: 'Erreur lors de la récupération des logs' });
    }
};
exports.getSuspiciousLogs = getSuspiciousLogs;
const blockIpAddress = async (req, res) => {
    const { ipAddress, reason } = req.body;
    if (!ipAddress) {
        return res.status(400).json({ status: 'error', message: 'Adresse IP requise' });
    }
    try {
        await database_1.prisma.auditLog.create({
            data: {
                action: 'IP_BLOCKED',
                reason: reason || 'Manual IP block',
                ipAddress,
                metadata: { blockedAt: new Date().toISOString() },
            },
        });
        logger.warn(`IP address blocked: ${ipAddress}`, { reason });
        return res.status(201).json({
            status: 'success',
            ipAddress,
            message: 'blocked',
        });
    }
    catch (error) {
        logger.error('Failed to block IP', { error });
        return res.status(500).json({ status: 'error', message: 'Erreur lors du blocage de l\'IP' });
    }
};
exports.blockIpAddress = blockIpAddress;
//# sourceMappingURL=security.controller.js.map