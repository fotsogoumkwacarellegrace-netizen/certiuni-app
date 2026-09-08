import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ServiceRequestStatus, UpdateRequestStatusDto } from './dto/update-request-status.dto';
export declare class ServiceRequestsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly requestInclude;
    create(userId: string, dto: CreateRequestDto): Promise<any>;
    findAllForStudent(userId: string): Promise<any>;
    findAll(status?: ServiceRequestStatus): Promise<any>;
    findOne(id: string, currentUser: {
        id: string;
        role: UserRole;
    }): Promise<any>;
    updateStatus(id: string, dto: UpdateRequestStatusDto): Promise<any>;
    cancelByStudent(id: string, userId: string): Promise<any>;
}
