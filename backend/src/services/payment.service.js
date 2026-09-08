"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = exports.PaymentService = exports.PaymentGateway = void 0;
const database_1 = require("../config/database");
const logger_util_1 = __importDefault(require("../common/utils/logger.util"));
const crypto_1 = __importDefault(require("crypto"));
var PaymentGateway;
(function (PaymentGateway) {
    PaymentGateway["MOMO"] = "MOMO";
    PaymentGateway["ORANGE"] = "ORANGE";
    PaymentGateway["CARD"] = "CARD";
})(PaymentGateway || (exports.PaymentGateway = PaymentGateway = {}));
class PaymentService {
    BASE_AMOUNT = 2000;
    async processPayment(payload) {
        try {
            const transactionReference = this._generateTransactionReference();
            const isSuccessful = await this._callPaymentGateway(payload.gateway, payload.phoneNumber || payload.cardToken || '', payload.amount);
            const payment = await database_1.prisma.payment.create({
                data: {
                    certificateId: payload.certificateId,
                    studentId: payload.studentId,
                    amount: payload.amount,
                    gateway: payload.gateway,
                    transactionReference,
                    isSuccessful,
                    paidAt: isSuccessful ? new Date() : null,
                },
            });
            if (isSuccessful) {
                await database_1.prisma.certificate.update({
                    where: { id: payload.certificateId },
                    data: { paymentState: 'PAID' },
                });
                logger_util_1.default.info(`Payment processed successfully for certificate ${payload.certificateId}`, {
                    transactionReference,
                });
            }
            return { payment, transactionReference, isSuccessful };
        }
        catch (error) {
            logger_util_1.default.error('Failed to process payment', { error });
            throw error;
        }
    }
    async getPaymentByReference(reference) {
        try {
            return await database_1.prisma.payment.findUnique({
                where: { transactionReference: reference },
            });
        }
        catch (error) {
            logger_util_1.default.error(`Failed to fetch payment with reference ${reference}`, { error });
            throw error;
        }
    }
    async getStudentPaymentHistory(studentId, limit = 50, offset = 0) {
        try {
            return await database_1.prisma.payment.findMany({
                where: { studentId },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
            });
        }
        catch (error) {
            logger_util_1.default.error(`Failed to fetch payment history for student ${studentId}`, { error });
            throw error;
        }
    }
    _generateTransactionReference() {
        return `TRX-${Date.now()}-${crypto_1.default.randomBytes(4).toString('hex').toUpperCase()}`;
    }
    async _callPaymentGateway(gateway, credential, amount) {
        logger_util_1.default.info(`[MOCK] Processing ${amount} FCFA payment via ${gateway} with credential ${credential}`);
        return Math.random() > 0.05;
    }
    getRequiredAmount() {
        return this.BASE_AMOUNT;
    }
}
exports.PaymentService = PaymentService;
exports.paymentService = new PaymentService();
//# sourceMappingURL=payment.service.js.map