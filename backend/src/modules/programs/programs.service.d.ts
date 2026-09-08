import { PrismaService } from '../prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
export declare class ProgramsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly programSelect;
    create(dto: CreateProgramDto): Promise<{
        description: string | null;
        code: string;
        university: {
            code: string;
            name: string;
            id: string;
        };
        name: string;
        id: string;
        isActive: never;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            certificates: number;
        };
    }>;
    findAll(): Promise<{
        description: string | null;
        code: string;
        university: {
            code: string;
            name: string;
            id: string;
        };
        name: string;
        id: string;
        isActive: never;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            certificates: number;
        };
    }[]>;
    findByUniversity(universityId: string): Promise<{
        description: string | null;
        code: string;
        university: {
            code: string;
            name: string;
            id: string;
        };
        name: string;
        id: string;
        isActive: never;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            certificates: number;
        };
    }[]>;
    findOne(id: string): Promise<{
        description: string | null;
        code: string;
        university: {
            code: string;
            name: string;
            id: string;
        };
        name: string;
        id: string;
        isActive: never;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            certificates: number;
        };
    }>;
    update(id: string, dto: UpdateProgramDto): Promise<{
        description: string | null;
        code: string;
        university: {
            code: string;
            name: string;
            id: string;
        };
        name: string;
        id: string;
        isActive: never;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            certificates: number;
        };
    }>;
    remove(id: string): Promise<{
        code: string;
        name: string;
        id: string;
    }>;
}
