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
            } | null;
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            universityId: string | null;
        } | null;
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
        birthDate: Date | null;
        birthPlace: string | null;
        nationality: string | null;
        gender: import(".prisma/client").$Enums.Gender | null;
        idCardNumber: string | null;
    }>;
    findAll(): Promise<{
        user: {
            university: {
                code: string;
                name: string;
                id: string;
            } | null;
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            universityId: string | null;
        } | null;
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
        birthDate: Date | null;
        birthPlace: string | null;
        nationality: string | null;
        gender: import(".prisma/client").$Enums.Gender | null;
        idCardNumber: string | null;
    }[]>;
    findByMatricule(matricule: string, body: any): Promise<{
        user: {
            university: {
                code: string;
                name: string;
                id: string;
            } | null;
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            universityId: string | null;
        } | null;
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
        birthDate: Date | null;
        birthPlace: string | null;
        nationality: string | null;
        gender: import(".prisma/client").$Enums.Gender | null;
        idCardNumber: string | null;
    }>;
    findByUserId(userId: string): Promise<{
        user: {
            university: {
                code: string;
                name: string;
                id: string;
            } | null;
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            universityId: string | null;
        } | null;
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
        birthDate: Date | null;
        birthPlace: string | null;
        nationality: string | null;
        gender: import(".prisma/client").$Enums.Gender | null;
        idCardNumber: string | null;
    }>;
    findOne(id: string): Promise<{
        user: {
            university: {
                code: string;
                name: string;
                id: string;
            } | null;
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            universityId: string | null;
        } | null;
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
        birthDate: Date | null;
        birthPlace: string | null;
        nationality: string | null;
        gender: import(".prisma/client").$Enums.Gender | null;
        idCardNumber: string | null;
    }>;
    update(id: string, dto: UpdateStudentDto): Promise<{
        user: {
            university: {
                code: string;
                name: string;
                id: string;
            } | null;
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            universityId: string | null;
        } | null;
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
        birthDate: Date | null;
        birthPlace: string | null;
        nationality: string | null;
        gender: import(".prisma/client").$Enums.Gender | null;
        idCardNumber: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        matricule: string;
    }>;
}
