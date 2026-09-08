import { PrismaService } from '../prisma/prisma.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
export declare class UniversitiesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly universitySelect;
    create(dto: CreateUniversityDto): Promise<{
        code: string;
        name: string;
        id: string;
        isActive: never;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            users: number;
            certificates: number;
        };
        domain: never;
        contactEmail: never;
        address: never;
    }>;
    findAll(): Promise<{
        code: string;
        name: string;
        id: string;
        isActive: never;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            users: number;
            certificates: number;
        };
        domain: never;
        contactEmail: never;
        address: never;
    }[]>;
    findOne(id: string): Promise<{
        code: string;
        name: string;
        id: string;
        isActive: never;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            users: number;
            certificates: number;
        };
        domain: never;
        contactEmail: never;
        address: never;
    }>;
    findByCode(code: string): Promise<{
        code: string;
        name: string;
        id: string;
        isActive: never;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            users: number;
            certificates: number;
        };
        domain: never;
        contactEmail: never;
        address: never;
    }>;
    update(id: string, dto: UpdateUniversityDto): Promise<{
        code: string;
        name: string;
        id: string;
        isActive: never;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            users: number;
            certificates: number;
        };
        domain: never;
        contactEmail: never;
        address: never;
    }>;
    remove(id: string): Promise<{
        code: string;
        name: string;
        id: string;
    }>;
}
