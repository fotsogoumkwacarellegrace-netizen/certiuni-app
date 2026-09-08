import { AcademicLevelsService } from './academic-levels.service';
import { CreateAcademicLevelDto } from './dto/create-academic-level.dto';
import { UpdateAcademicLevelDto } from './dto/update-academic-level.dto';
export declare class AcademicLevelsController {
    private readonly academicLevelsService;
    constructor(academicLevelsService: AcademicLevelsService);
    create(dto: CreateAcademicLevelDto): Promise<{
        code: string;
        university: {
            code: string;
            name: string;
            id: string;
        };
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        code: string;
        university: {
            code: string;
            name: string;
            id: string;
        };
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findByUniversity(universityId: string): Promise<{
        code: string;
        university: {
            code: string;
            name: string;
            id: string;
        };
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        code: string;
        university: {
            code: string;
            name: string;
            id: string;
        };
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateAcademicLevelDto): Promise<{
        code: string;
        university: {
            code: string;
            name: string;
            id: string;
        };
        name: string;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        code: string;
        name: string;
        id: string;
    }>;
}
