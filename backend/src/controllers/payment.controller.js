"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentReceipt = exports.getPaymentHistory = exports.processPayment = void 0;
const openapi = require("@nestjs/swagger");
const database_1 = require("../config/database");
const payment_service_1 = require("../services/payment.service");
const email_service_1 = require("../services/email.service");
const notification_service_1 = require("../services/notification.service");
const processPayment = async (req, res) => {
    const { certificateId, gateway, phoneNumber, cardToken } = req.body;
    const certificate = await database_1.prisma.certificate.findUnique({
        where: { id: certificateId },
        include: { university: true },
    });
    if (!certificate) {
        return res.status(404).json({ status: 'error', message: 'Diplôme introuvable' });
    }
    const amount = payment_service_1.paymentService.getRequiredAmount();
    const result = await payment_service_1.paymentService.processPayment({
        certificateId,
        studentId: certificate.id,
        amount,
        gateway: gateway,
        phoneNumber,
        cardToken,
    });
    if (result.isSuccessful) {
        await email_service_1.emailService.sendPaymentReceiptEmail(certificate.studentEmail, certificateId, amount, result.transactionReference);
        await notification_service_1.notificationService.notifyPaymentReceived(certificate.universityId, amount, `${certificate.studentFirstName} ${certificate.studentLastName}`);
    }
    return res.status(result.isSuccessful ? 200 : 400).json({ status: result.isSuccessful ? 'success' : 'error', data: result });
};
exports.processPayment = processPayment;
const getPaymentHistory = async (req, res) => {
    const { limit = 50, offset = 0 } = req.query;
    const payments = await database_1.prisma.payment.findMany({
        orderBy: { createdAt: 'desc' },
        take: Math.min(parseInt(limit) || 50, 100),
        skip: parseInt(offset) || 0,
    });
    return res.status(200).json({ status: 'success', data: payments });
};
exports.getPaymentHistory = getPaymentHistory;
const getPaymentReceipt = async (req, res) => {
    const { transactionRef } = req.params;
    const payment = await payment_service_1.paymentService.getPaymentByReference(transactionRef);
    if (!payment) {
        return res.status(404).json({ status: 'error', message: 'Paiement introuvable' });
    }
    return res.status(200).json({ status: 'success', data: payment });
};
exports.getPaymentReceipt = getPaymentReceipt;
//# sourceMappingURL=payment.controller.js.map