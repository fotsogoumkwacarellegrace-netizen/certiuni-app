"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const payment_status_dto_1 = require("./dto/payment-status.dto");
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    paymentInclude = {
        request: {
            include: {
                service: true,
                student: {
                    select: {
                        id: true,
                        matricule: true,
                        user: { select: { firstName: true, lastName: true, email: true } },
                    },
                },
            },
        },
    };
    async initiatePayment(userId, dto) {
        const serviceRequest = await this.prisma.serviceRequest.findUnique({
            where: { id: dto.requestId },
            include: { student: true },
        });
        if (!serviceRequest) {
            throw new common_1.NotFoundException('Demande de service introuvable.');
        }
        if (serviceRequest.student.userId !== userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez régler que vos propres demandes.');
        }
        const transactionReference = `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        return this.prisma.payment.create({
            data: {
                requestId: dto.requestId,
                amount: dto.amount,
                provider: dto.provider,
                status: payment_status_dto_1.PaymentStatus.PENDING,
                transactionId: transactionReference,
            },
            include: this.paymentInclude,
        });
    }
    async processPaymentStatus(id, dto) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: { request: true },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Transaction de paiement introuvable (#${id}).`);
        }
        const updatedPayment = await this.prisma.payment.update({
            where: { id },
            data: {
                status: dto.status,
                ...(dto.transactionRef && { transactionRef: dto.transactionRef }),
            },
            include: this.paymentInclude,
        });
        if (dto.status === payment_status_dto_1.PaymentStatus.SUCCESSFUL) {
            await this.prisma.serviceRequest.update({
                where: { id: payment.requestId },
                data: { status: 'PROCESSING' },
            });
        }
        return updatedPayment;
    }
    async findAll() {
        return this.prisma.payment.findMany({
            include: this.paymentInclude,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, currentUser) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: this.paymentInclude,
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Paiement introuvable (#${id}).`);
        }
        if (currentUser.role === client_1.UserRole.STUDENT &&
            payment.request?.student?.user?.email !== currentUser.id) {
            throw new common_1.ForbiddenException('Accès refusé à cette transaction.');
        }
        return payment;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map