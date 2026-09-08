import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { PaymentStatusDto } from './dto/payment-status.dto';
export declare class PaymentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly paymentInclude;
    initiatePayment(userId: string, dto: InitiatePaymentDto): Promise<{
        request: {
            student: {
                user: {
                    email: string;
                    firstName: string;
                    lastName: string;
                };
                id: string;
                matricule: string;
            };
            service: {
                code: string;
                name: string;
                description: string | null;
                id: string;
                universityId: string;
                createdAt: Date;
                updatedAt: Date;
                documentTypeId: string;
            };
        } & {
            status: import(".prisma/client").$Enums.RequestStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            serviceId: string;
            currency: string;
            notes: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            requestNumber: string;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            handledById: string | null;
        };
    } & {
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string | null;
        currency: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        requestId: string;
        provider: import(".prisma/client").$Enums.PaymentMethod;
        transactionId: string | null;
        transactionReference: string | null;
        certificateId: string | null;
    }>;
    processPaymentStatus(id: string, dto: PaymentStatusDto): Promise<{
        request: {
            student: {
                user: {
                    email: string;
                    firstName: string;
                    lastName: string;
                };
                id: string;
                matricule: string;
            };
            service: {
                code: string;
                name: string;
                description: string | null;
                id: string;
                universityId: string;
                createdAt: Date;
                updatedAt: Date;
                documentTypeId: string;
            };
        } & {
            status: import(".prisma/client").$Enums.RequestStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            serviceId: string;
            currency: string;
            notes: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            requestNumber: string;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            handledById: string | null;
        };
    } & {
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string | null;
        currency: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        requestId: string;
        provider: import(".prisma/client").$Enums.PaymentMethod;
        transactionId: string | null;
        transactionReference: string | null;
        certificateId: string | null;
    }>;
    findAll(): Promise<({
        request: {
            student: {
                user: {
                    email: string;
                    firstName: string;
                    lastName: string;
                };
                id: string;
                matricule: string;
            };
            service: {
                code: string;
                name: string;
                description: string | null;
                id: string;
                universityId: string;
                createdAt: Date;
                updatedAt: Date;
                documentTypeId: string;
            };
        } & {
            status: import(".prisma/client").$Enums.RequestStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            serviceId: string;
            currency: string;
            notes: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            requestNumber: string;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            handledById: string | null;
        };
    } & {
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string | null;
        currency: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        requestId: string;
        provider: import(".prisma/client").$Enums.PaymentMethod;
        transactionId: string | null;
        transactionReference: string | null;
        certificateId: string | null;
    })[]>;
    findOne(id: string, currentUser: {
        id: string;
        role: UserRole;
    }): Promise<{
        request: {
            student: {
                user: {
                    email: string;
                    firstName: string;
                    lastName: string;
                };
                id: string;
                matricule: string;
            };
            service: {
                code: string;
                name: string;
                description: string | null;
                id: string;
                universityId: string;
                createdAt: Date;
                updatedAt: Date;
                documentTypeId: string;
            };
        } & {
            status: import(".prisma/client").$Enums.RequestStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            serviceId: string;
            currency: string;
            notes: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            requestNumber: string;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            handledById: string | null;
        };
    } & {
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string | null;
        currency: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        requestId: string;
        provider: import(".prisma/client").$Enums.PaymentMethod;
        transactionId: string | null;
        transactionReference: string | null;
        certificateId: string | null;
    }>;
}
