import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(dto: CreateStudentDto): Promise<{
        user: {
            university: {
                code: string;
                name: string;
                id: string;
            };
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            universityId: string;
        };
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        enrollments: {
            status: import(".prisma/client").$Enums.EnrollmentStatus;
            program: {
                code: string;
                name: string;
            };
            academicLevel: {
                code: string;
            };
            academicYear: {
                year: string;
            };
            id: string;
        }[];
        matricule: string;
        birthDate: Date;
        birthPlace: string;
        nationality: string;
        gender: import(".prisma/client").$Enums.Gender;
        idCardNumber: string;
    }>;
    findAll(): Promise<{
        user: {
            university: {
                code: string;
                name: string;
                id: string;
            };
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            universityId: string;
        };
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        enrollments: {
            status: import(".prisma/client").$Enums.EnrollmentStatus;
            program: {
                code: string;
                name: string;
            };
            academicLevel: {
                code: string;
            };
            academicYear: {
                year: string;
            };
            id: string;
        }[];
        matricule: string;
        birthDate: Date;
        birthPlace: string;
        nationality: string;
        gender: import(".prisma/client").$Enums.Gender;
        idCardNumber: string;
    }[]>;
    findByMatricule(matricule: string, body: any): Promise<{
        user: {
            university: {
                code: string;
                name: string;
                id: string;
            };
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            universityId: string;
        };
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        enrollments: {
            status: import(".prisma/client").$Enums.EnrollmentStatus;
            program: {
                code: string;
                name: string;
            };
            academicLevel: {
                code: string;
            };
            academicYear: {
                year: string;
            };
            id: string;
        }[];
        matricule: string;
        birthDate: Date;
        birthPlace: string;
        nationality: string;
        gender: import(".prisma/client").$Enums.Gender;
        idCardNumber: string;
    }>;
    findByUserId(userId: string): Promise<{
        user: {
            university: {
                code: string;
                name: string;
                id: string;
            };
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            universityId: string;
        };
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        enrollments: {
            status: import(".prisma/client").$Enums.EnrollmentStatus;
            program: {
                code: string;
                name: string;
            };
            academicLevel: {
                code: string;
            };
            academicYear: {
                year: string;
            };
            id: string;
        }[];
        matricule: string;
        birthDate: Date;
        birthPlace: string;
        nationality: string;
        gender: import(".prisma/client").$Enums.Gender;
        idCardNumber: string;
    }>;
    findOne(id: string): Promise<{
        user: {
            university: {
                code: string;
                name: string;
                id: string;
            };
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            universityId: string;
        };
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        enrollments: {
            status: import(".prisma/client").$Enums.EnrollmentStatus;
            program: {
                code: string;
                name: string;
            };
            academicLevel: {
                code: string;
            };
            academicYear: {
                year: string;
            };
            id: string;
        }[];
        matricule: string;
        birthDate: Date;
        birthPlace: string;
        nationality: string;
        gender: import(".prisma/client").$Enums.Gender;
        idCardNumber: string;
    }>;
    update(id: string, dto: UpdateStudentDto): Promise<{
        user: {
            university: {
                code: string;
                name: string;
                id: string;
            };
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            universityId: string;
        };
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        enrollments: {
            status: import(".prisma/client").$Enums.EnrollmentStatus;
            program: {
                code: string;
                name: string;
            };
            academicLevel: {
                code: string;
            };
            academicYear: {
                year: string;
            };
            id: string;
        }[];
        matricule: string;
        birthDate: Date;
        birthPlace: string;
        nationality: string;
        gender: import(".prisma/client").$Enums.Gender;
        idCardNumber: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        matricule: string;
    }>;
}
