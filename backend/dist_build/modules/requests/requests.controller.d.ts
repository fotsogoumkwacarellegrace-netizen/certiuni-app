import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(dto: CreateRequestDto): Promise<{
        status: import(".prisma/client").$Enums.RequestStatus;
        id: string;
        createdAt: Date;
    }>;
    getStatus(trackingCode: string): Promise<{
        status: import(".prisma/client").$Enums.RequestStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(user: any): Promise<{
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
    }[]>;
    findOne(id: string, user: any): Promise<{
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
    }>;
    updateStatus(id: string, dto: UpdateRequestStatusDto, user: any): Promise<{
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
    }>;
}
