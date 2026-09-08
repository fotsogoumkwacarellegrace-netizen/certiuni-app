import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateServiceDto): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    findAll(includeInactive?: boolean): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }[]>;
    findOne(id: string): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    findByCode(code: string): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    update(id: string, dto: UpdateServiceDto): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
}
