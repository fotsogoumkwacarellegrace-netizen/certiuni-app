import { AcademicService } from './academic.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { CreateLevelDto } from './dto/create-level.dto';
export declare class AcademicController {
    private readonly academicService;
    constructor(academicService: AcademicService);
    createYear(dto: CreateAcademicYearDto, user: any, universityId?: string): Promise<{
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        year: string;
    }>;
    findAllYears(user: any): Promise<{
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        year: string;
    }[]>;
    createProgram(dto: CreateProgramDto, user: any, universityId?: string): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllPrograms(user: any): Promise<{
        description: string | null;
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createLevel(dto: CreateLevelDto, user: any, universityId?: string): Promise<{
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllLevels(user: any): Promise<{
        code: string;
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
