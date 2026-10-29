import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    ServiceUnavailableException,
} from '@nestjs/common';
import { PaymentMethod, PaymentStatus, Prisma, UserRole } from '@prisma/client';
import Stripe from 'stripe';
import { PrismaService } from '../../common/prisma/prisma.service';
import { env } from '../../config/env.config';
import {
    PAYMENT_PROVIDER,
    PaymentProvider,
} from '../integrations/providers/payment-gateways/payment-provider.interface';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

const ZERO_DECIMAL_CURRENCIES = new Set([
    'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg',
    'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf',
]);

@Injectable()
export class PaymentsService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(PAYMENT_PROVIDER) private readonly paymentProvider: PaymentProvider,
    ) { }

    private readonly paymentInclude = {
        request: {
            include: {
                service: true,
                student: {
                    select: {
                        id: true,
                        matricule: true,
                        user: { select: { id: true, firstName: true, lastName: true, email: true } },
                    },
                },
            },
        },
    };

    async initiatePayment(userId: string, dto: InitiatePaymentDto) {
        if (!this.paymentProvider.configured) {
            throw new ServiceUnavailableException({
                error: 'not_configured',
                feature: 'stripe',
            });
        }
        const appUrl = env.APP_URL;
        if (!appUrl) {
            throw new ServiceUnavailableException({
                error: 'not_configured',
                feature: 'stripe-checkout-redirects',
            });
        }

        const request = await this.prisma.request.findUnique({
            where: { id: dto.requestId },
            include: {
                service: true,
                student: {
                    include: {
                        user: { select: { id: true, email: true } },
                    },
                },
            },
        });

        if (!request) {
            throw new NotFoundException('Demande de service introuvable.');
        }

        if (request.student.userId !== userId || !request.student.user) {
            throw new ForbiddenException('Vous ne pouvez régler que vos propres demandes.');
        }

        if (request.paymentStatus !== PaymentStatus.UNPAID) {
            throw new ConflictException('Cette demande ne peut pas être payée dans son état actuel.');
        }

        const amount = Number(request.amount);
        const currency = request.currency.toLowerCase();
        if (!Number.isFinite(amount) || amount <= 0 || !/^[a-z]{3}$/.test(currency)) {
            throw new BadRequestException('Le tarif de cette demande ne permet pas un paiement Stripe.');
        }

        let payment = await this.prisma.payment.findFirst({
            where: {
                requestId: request.id,
                provider: PaymentMethod.STRIPE,
                status: PaymentStatus.PENDING,
            },
            orderBy: { createdAt: 'desc' },
        });

        if (payment?.transactionId) {
            const existingSession = await this.paymentProvider.retrieveCheckoutSession(payment.transactionId);
            if (existingSession.status !== 'expired') {
                return {
                    payment,
                    checkoutUrl: existingSession.url,
                };
            }
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: { status: PaymentStatus.FAILED },
            });
            payment = null;
        }

        if (!payment) {
            payment = await this.prisma.payment.create({
                data: {
                    requestId: request.id,
                    studentId: request.studentId,
                    amount: request.amount,
                    currency: request.currency,
                    provider: PaymentMethod.STRIPE,
                    status: PaymentStatus.PENDING,
                },
            });
        }

        const session = await this.paymentProvider.createCheckoutSession(
            {
                mode: 'payment',
                customer_email: request.student.user.email,
                client_reference_id: request.id,
                line_items: [{
                    price_data: {
                        currency,
                        product_data: { name: request.service.name },
                        unit_amount: this.toMinorUnits(amount, currency),
                    },
                    quantity: 1,
                }],
                metadata: {
                    paymentId: payment.id,
                    requestId: request.id,
                },
                success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${appUrl}/payment/cancel`,
            },
            `payment-${payment.id}`,
        );

        const updatedPayment = await this.prisma.payment.update({
            where: { id: payment.id },
            data: { transactionId: session.id },
            include: this.paymentInclude,
        });

        return {
            payment: updatedPayment,
            checkoutUrl: session.url,
        };
    }

    async handleStripeWebhook(payload: Buffer, signature: string) {
        if (!this.paymentProvider.configured) {
            throw new ServiceUnavailableException({
                error: 'not_configured',
                feature: 'stripe',
            });
        }

        let event: Stripe.Event;
        try {
            event = this.paymentProvider.constructWebhookEvent(payload, signature);
        } catch (error) {
            if (
                error instanceof SyntaxError ||
                (error instanceof Error && error.name === 'StripeSignatureVerificationError')
            ) {
                throw new BadRequestException('Signature du webhook Stripe invalide.');
            }
            throw error;
        }

        try {
            return await this.prisma.$transaction(async (transaction) => {
                const existing = await transaction.stripeWebhookEvent.findUnique({
                    where: { id: event.id },
                    select: { id: true },
                });
                if (existing) {
                    return { received: true, duplicate: true };
                }

                const sessionEventTypes = new Set([
                    'checkout.session.completed',
                    'checkout.session.async_payment_succeeded',
                    'checkout.session.async_payment_failed',
                    'checkout.session.expired',
                ]);
                let session: Stripe.Checkout.Session | undefined;
                let sessionPaymentId: string | undefined;
                let sessionRequestId: string | undefined;
                if (sessionEventTypes.has(event.type)) {
                    session = event.data.object as Stripe.Checkout.Session;
                    sessionPaymentId = session.metadata?.paymentId;
                    sessionRequestId = session.metadata?.requestId;
                    if (!sessionPaymentId || !sessionRequestId) {
                        throw new BadRequestException('Le paiement Stripe ne contient pas de référence interne.');
                    }

                    const payment = await transaction.payment.findUnique({
                        where: { id: sessionPaymentId },
                    });
                    if (!payment || payment.provider !== PaymentMethod.STRIPE) {
                        throw new NotFoundException('Paiement interne associé à la session Stripe introuvable.');
                    }
                    if (
                        (session.amount_total !== null && session.amount_total !== this.toMinorUnits(
                            Number(payment.amount),
                            payment.currency.toLowerCase(),
                        )) ||
                        (session.currency && session.currency !== payment.currency.toLowerCase())
                    ) {
                        throw new BadRequestException('Le montant ou la devise Stripe ne correspond pas au paiement.');
                    }
                }

                await transaction.stripeWebhookEvent.create({
                    data: { id: event.id, type: event.type },
                });

                if (session && sessionPaymentId && sessionRequestId) {
                    const succeeded = event.type === 'checkout.session.async_payment_succeeded' ||
                        (event.type === 'checkout.session.completed' && session.payment_status === 'paid');
                    const failed = event.type === 'checkout.session.async_payment_failed' ||
                        event.type === 'checkout.session.expired';

                    if (succeeded || failed) {
                        const result = await transaction.payment.updateMany({
                            where: {
                                id: sessionPaymentId,
                                status: succeeded
                                    ? { in: [PaymentStatus.PENDING, PaymentStatus.FAILED] }
                                    : PaymentStatus.PENDING,
                            },
                            data: {
                                status: succeeded ? PaymentStatus.SUCCESSFUL : PaymentStatus.FAILED,
                                ...(succeeded && typeof session.payment_intent === 'string'
                                    ? { transactionReference: session.payment_intent }
                                    : {}),
                            },
                        });

                        if (result.count > 0) {
                            await transaction.request.update({
                                where: { id: sessionRequestId },
                                data: {
                                    paymentStatus: succeeded
                                        ? PaymentStatus.SUCCESSFUL
                                        : PaymentStatus.UNPAID,
                                },
                            });
                        }
                    }
                }

                return { received: true, duplicate: false };
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                return { received: true, duplicate: true };
            }
            throw error;
        }
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
            payment.request?.student?.user?.id !== currentUser.id
        ) {
            throw new ForbiddenException('Accès refusé à cette transaction.');
        }

        return payment;
    }

    private toMinorUnits(amount: number, currency: string): number {
        return Math.round(amount * (ZERO_DECIMAL_CURRENCIES.has(currency) ? 1 : 100));
    }
}
