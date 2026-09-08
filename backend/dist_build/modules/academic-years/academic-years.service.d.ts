import { PrismaService } from '../prisma/prisma.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
export declare class AcademicYearsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly yearSelect;
    create(dto: CreateAcademicYearDto): Promise<{
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        year: string;
    }>;
    findAll(): Promise<{
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        year: string;
    }[]>;
    findCurrent(): Promise<{
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        year: string;
    }>;
    findOne(id: string): Promise<{
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        year: string;
    }>;
    update(id: string, dto: UpdateAcademicYearDto): Promise<{
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        year: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        year: string;
    }>;
}
