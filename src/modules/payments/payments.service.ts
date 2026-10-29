import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { PaymentStatus, PaymentStatusDto } from './dto/payment-status.dto';

@Injectable()
export class PaymentsService {
    constructor(private readonly prisma: PrismaService) { }

    private readonly paymentInclude = {
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

    async initiatePayment(userId: string, dto: InitiatePaymentDto) {
        const serviceRequest = await (this.prisma as any).serviceRequest.findUnique({
            where: { id: dto.requestId },
            include: { student: true },
        });

        if (!serviceRequest) {
            throw new NotFoundException('Demande de service introuvable.');
        }

        if (serviceRequest.student.userId !== userId) {
            throw new ForbiddenException('Vous ne pouvez régler que vos propres demandes.');
        }

        const transactionReference = `PAY-${Date.now()}-${Math.floor(
            1000 + Math.random() * 9000,
        )}`;

        return this.prisma.payment.create({
            data: {
                requestId: dto.requestId,
                amount: dto.amount,
                provider: dto.provider as any,
                // phoneNumber: dto.phoneNumber?.trim(),
                status: PaymentStatus.PENDING,
                transactionId: transactionReference,
            },
            include: this.paymentInclude,
        });
    }

    async processPaymentStatus(id: string, dto: PaymentStatusDto) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: { request: true },
        });

        if (!payment) {
            throw new NotFoundException(`Transaction de paiement introuvable (#${id}).`);
        }

        const updatedPayment = await this.prisma.payment.update({
            where: { id },
            data: {
                status: dto.status,
                ...(dto.transactionRef && { transactionRef: dto.transactionRef }),
            },
            include: this.paymentInclude,
        });

        if (dto.status === PaymentStatus.SUCCESSFUL) {
            await (this.prisma as any).serviceRequest.update({
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

    async findOne(id: string, currentUser: { id: string; role: UserRole }) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: this.paymentInclude,
        });

        if (!payment) {
            throw new NotFoundException(`Paiement introuvable (#${id}).`);
        }

        if (
            currentUser.role === UserRole.STUDENT &&
            payment.request?.student?.user?.email !== currentUser.id
        ) {
            throw new ForbiddenException('Accès refusé à cette transaction.');
        }

        return payment;
    }
}