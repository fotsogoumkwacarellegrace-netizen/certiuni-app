import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentStatusDto } from './dto/update-enrollment-status.dto';
export declare class EnrollmentsController {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    create(dto: CreateEnrollmentDto): Promise<{
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        program: {
            code: string;
            name: string;
            id: string;
        };
        academicLevel: {
            code: string;
            name: string;
            id: string;
        };
        academicYear: {
            id: string;
            year: string;
            isCurrent: never;
        };
        student: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        program: {
            code: string;
            name: string;
            id: string;
        };
        academicLevel: {
            code: string;
            name: string;
            id: string;
        };
        academicYear: {
            id: string;
            year: string;
            isCurrent: never;
        };
        student: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        program: {
            code: string;
            name: string;
            id: string;
        };
        academicLevel: {
            code: string;
            name: string;
            id: string;
        };
        academicYear: {
            id: string;
            year: string;
            isCurrent: never;
        };
        student: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByStudent(studentId: string): Promise<{
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        program: {
            code: string;
            name: string;
            id: string;
        };
        academicLevel: {
            code: string;
            name: string;
            id: string;
        };
        academicYear: {
            id: string;
            year: string;
            isCurrent: never;
        };
        student: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findByProgramAndYear(programId: string, academicYearId: string): Promise<{
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        program: {
            code: string;
            name: string;
            id: string;
        };
        academicLevel: {
            code: string;
            name: string;
            id: string;
        };
        academicYear: {
            id: string;
            year: string;
            isCurrent: never;
        };
        student: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateStatus(id: string, dto: UpdateEnrollmentStatusDto): Promise<{
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        program: {
            code: string;
            name: string;
            id: string;
        };
        academicLevel: {
            code: string;
            name: string;
            id: string;
        };
        academicYear: {
            id: string;
            year: string;
            isCurrent: never;
        };
        student: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        id: string;
    }>;
}
