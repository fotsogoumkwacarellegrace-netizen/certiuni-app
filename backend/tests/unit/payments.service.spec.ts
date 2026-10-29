import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';
import { PrismaService } from '../../src/common/prisma/prisma.service';
import {
    PAYMENT_PROVIDER,
    PaymentProvider,
} from '../../src/modules/integrations/providers/payment-gateways/payment-provider.interface';
import { PaymentsService } from '../../src/modules/payments/payments.service';

type TransactionMock = {
    stripeWebhookEvent: { findUnique: jest.Mock; create: jest.Mock };
    payment: { findUnique: jest.Mock; updateMany: jest.Mock };
    request: { update: jest.Mock };
};

type PrismaMock = {
    request: { findUnique: jest.Mock };
    payment: {
        findFirst: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        findMany: jest.Mock;
        findUnique: jest.Mock;
    };
    $transaction: jest.Mock;
};

describe('PaymentsService', () => {
    let service: PaymentsService;
    let module: TestingModule;
    let prisma: PrismaMock;
    let transaction: TransactionMock;
    let provider: jest.Mocked<PaymentProvider>;

    beforeEach(async () => {
        transaction = {
            stripeWebhookEvent: {
                findUnique: jest.fn().mockResolvedValue(null),
                create: jest.fn().mockResolvedValue({}),
            },
            payment: {
                findUnique: jest.fn().mockResolvedValue({
                    id: 'payment-id',
                    provider: PaymentMethod.STRIPE,
                    amount: 1250,
                    currency: 'XAF',
                }),
                updateMany: jest.fn().mockResolvedValue({ count: 1 }),
            },
            request: {
                update: jest.fn().mockResolvedValue({}),
            },
        };

        prisma = {
            request: {
                findUnique: jest.fn().mockResolvedValue({
                    id: 'request-id',
                    requestNumber: 'REQ-1',
                    amount: 1250,
                    currency: 'XAF',
                    paymentStatus: PaymentStatus.UNPAID,
                    studentId: 'student-id',
                    student: {
                        userId: 'user-id',
                        user: { id: 'user-id', email: 'student@example.test' },
                    },
                    service: { name: 'Attestation' },
                }),
            },
            payment: {
                findFirst: jest.fn().mockResolvedValue(null),
                create: jest.fn().mockResolvedValue({
                    id: 'payment-id',
                    amount: 1250,
                    currency: 'XAF',
                }),
                update: jest.fn().mockResolvedValue({
                    id: 'payment-id',
                    amount: 1250,
                    currency: 'XAF',
                }),
                findMany: jest.fn(),
                findUnique: jest.fn(),
            },
            $transaction: jest.fn(
                async (operation: (tx: TransactionMock) => Promise<unknown>) => operation(transaction),
            ),
        };

        provider = {
            configured: true,
            mode: 'test',
            createCheckoutSession: jest.fn().mockResolvedValue({
                id: 'cs_test',
                url: 'https://checkout.stripe.test/session',
                status: 'open',
            }),
            retrieveCheckoutSession: jest.fn(),
            constructWebhookEvent: jest.fn(),
            verifyConnection: jest.fn(),
        };

        module = await Test.createTestingModule({
            providers: [
                PaymentsService,
                { provide: PrismaService, useValue: prisma },
                { provide: PAYMENT_PROVIDER, useValue: provider },
            ],
        }).compile();
        service = module.get(PaymentsService);
    });

    afterEach(async () => {
        await module.close();
    });

    it('creates a Stripe Checkout session from the server-side request amount', async () => {
        const result = await service.initiatePayment('user-id', { requestId: 'request-id' });

        expect(provider.createCheckoutSession).toHaveBeenCalledWith(
            expect.objectContaining({
                line_items: [{
                    price_data: expect.objectContaining({
                        currency: 'xaf',
                        unit_amount: 1250,
                    }),
                    quantity: 1,
                }],
            }),
            'payment-payment-id',
        );
        expect(result.checkoutUrl).toBe('https://checkout.stripe.test/session');
        expect(prisma.payment.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                amount: 1250,
                provider: PaymentMethod.STRIPE,
                status: PaymentStatus.PENDING,
            }),
        });
    });

    it('marks a successfully paid request only after the signed Stripe event is received', async () => {
        provider.constructWebhookEvent.mockReturnValue({
            id: 'evt-success',
            type: 'checkout.session.completed',
            data: {
                object: {
                    id: 'cs_test',
                    metadata: { paymentId: 'payment-id', requestId: 'request-id' },
                    amount_total: 1250,
                    currency: 'xaf',
                    payment_status: 'paid',
                    payment_intent: 'pi_test',
                },
            },
        } as Stripe.Event);

        await expect(
            service.handleStripeWebhook(Buffer.from('{}'), 'signature'),
        ).resolves.toEqual({ received: true, duplicate: false });

        expect(transaction.payment.updateMany).toHaveBeenCalledWith({
            where: {
                id: 'payment-id',
                status: { in: [PaymentStatus.PENDING, PaymentStatus.FAILED] },
            },
            data: {
                status: PaymentStatus.SUCCESSFUL,
                transactionReference: 'pi_test',
            },
        });
        expect(transaction.request.update).toHaveBeenCalledWith({
            where: { id: 'request-id' },
            data: { paymentStatus: PaymentStatus.SUCCESSFUL },
        });
    });

    it('records a failed Stripe checkout without marking the request paid', async () => {
        provider.constructWebhookEvent.mockReturnValue({
            id: 'evt-failure',
            type: 'checkout.session.async_payment_failed',
            data: {
                object: {
                    id: 'cs_test',
                    metadata: { paymentId: 'payment-id', requestId: 'request-id' },
                    amount_total: 1250,
                    currency: 'xaf',
                    payment_status: 'unpaid',
                },
            },
        } as Stripe.Event);

        await service.handleStripeWebhook(Buffer.from('{}'), 'signature');

        expect(transaction.payment.updateMany).toHaveBeenCalledWith({
            where: { id: 'payment-id', status: PaymentStatus.PENDING },
            data: { status: PaymentStatus.FAILED },
        });
        expect(transaction.request.update).toHaveBeenCalledWith({
            where: { id: 'request-id' },
            data: { paymentStatus: PaymentStatus.UNPAID },
        });
    });

    it('ignores duplicate webhook event IDs', async () => {
        transaction.stripeWebhookEvent.findUnique.mockResolvedValue({ id: 'evt-duplicate' });
        provider.constructWebhookEvent.mockReturnValue({
            id: 'evt-duplicate',
            type: 'checkout.session.completed',
            data: { object: {} },
        } as Stripe.Event);

        await expect(
            service.handleStripeWebhook(Buffer.from('{}'), 'signature'),
        ).resolves.toEqual({ received: true, duplicate: true });
        expect(transaction.stripeWebhookEvent.create).not.toHaveBeenCalled();
    });

    it('rejects invalid webhook signatures', async () => {
        provider.constructWebhookEvent.mockImplementation(() => {
            const error = new Error('signature rejected');
            error.name = 'StripeSignatureVerificationError';
            throw error;
        });

        await expect(
            service.handleStripeWebhook(Buffer.from('{}'), 'invalid'),
        ).rejects.toBeInstanceOf(BadRequestException);
    });
});
