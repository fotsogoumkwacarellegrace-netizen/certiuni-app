import { PrismaService } from '../prisma/prisma.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
export declare class TariffsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly tariffInclude;
    create(dto: CreateTariffDto): Promise<{
        university: {
            code: string;
            name: string;
            id: string;
        };
        service: never;
    } & {
        code: string;
        name: string;
        description: string | null;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    findAll(universityId?: string): Promise<({
        university: {
            code: string;
            name: string;
            id: string;
        };
        service: never;
    } & {
        code: string;
        name: string;
        description: string | null;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    })[]>;
    findOne(id: string): Promise<{
        university: {
            code: string;
            name: string;
            id: string;
        };
        service: never;
    } & {
        code: string;
        name: string;
        description: string | null;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    update(id: string, dto: UpdateTariffDto): Promise<{
        university: {
            code: string;
            name: string;
            id: string;
        };
        service: never;
    } & {
        code: string;
        name: string;
        description: string | null;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
    remove(id: string): Promise<{
        code: string;
        name: string;
        description: string | null;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        documentTypeId: string;
    }>;
}
