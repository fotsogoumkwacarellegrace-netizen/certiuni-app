import { PrismaService } from '../prisma/prisma.service';
import { IssueCertificateDto } from './dto/issue-certificate.dto';
import { RevokeCertificateDto } from './dto/revoke-certificate.dto';
import { Prisma } from '@prisma/client';
export declare class CertificatesService {
    private readonly prisma;
    private readonly baseUrl;
    constructor(prisma: PrismaService);
    private readonly defaultInclude;
    issueCertificate(dto: IssueCertificateDto, currentUser: any): Promise<{
        message: string;
        certificate: {
            id: string;
            publicIdentifier: string;
            canonicalHash: string;
            verificationUrl: string;
            qrCodeDataUrl: string;
            studentName: string;
            degreeTitle: string;
            universityName: string;
            issuedAt: Date;
            details: {
                university: {
                    code: string;
                    name: string;
                    id: string;
                    logoUrl: string | null;
                };
                program: {
                    code: string;
                    name: string;
                    id: string;
                } | null;
                academicLevel: {
                    code: string;
                    name: string;
                    id: string;
                } | null;
                academicYear: {
                    id: string;
                    universityId: string;
                    year: string;
                } | null;
                student: {
                    email: string | null;
                    id: string;
                    firstName: string;
                    lastName: string;
                    matricule: string;
                } | null;
                template: {
                    name: string;
                    id: string;
                    layoutConfig: Prisma.JsonValue;
                } | null;
                issuedBy: {
                    email: string;
                    id: string;
                    firstName: string;
                    lastName: string;
                };
            } & {
                status: import(".prisma/client").$Enums.CertificateStatus;
                id: string;
                universityId: string;
                createdAt: Date;
                updatedAt: Date;
                studentId: string | null;
                programId: string | null;
                templateId: string | null;
                levelId: string | null;
                yearId: string | null;
                publicIdentifier: string;
                canonicalHash: string;
                paymentState: string;
                metadataJson: Prisma.JsonValue | null;
                studentIdentifier: string;
                studentFirstName: string;
                studentLastName: string;
                studentEmail: string;
                degreeTitle: string;
                fieldOfStudy: string;
                grade: string | null;
                issueDate: Date;
                pdfUrl: string | null;
                pdfKey: string | null;
                revokedAt: Date | null;
                revocationReason: string | null;
                issuedById: string;
                typeId: string | null;
            };
        };
    }>;
    findAll(currentUser: any): Promise<({
        university: {
            code: string;
            name: string;
            id: string;
            logoUrl: string | null;
        };
        program: {
            code: string;
            name: string;
            id: string;
        } | null;
        academicLevel: {
            code: string;
            name: string;
            id: string;
        } | null;
        academicYear: {
            id: string;
            universityId: string;
            year: string;
        } | null;
        student: {
            email: string | null;
            id: string;
            firstName: string;
            lastName: string;
            matricule: string;
        } | null;
        template: {
            name: string;
            id: string;
            layoutConfig: Prisma.JsonValue;
        } | null;
        issuedBy: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        status: import(".prisma/client").$Enums.CertificateStatus;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string | null;
        programId: string | null;
        templateId: string | null;
        levelId: string | null;
        yearId: string | null;
        publicIdentifier: string;
        canonicalHash: string;
        paymentState: string;
        metadataJson: Prisma.JsonValue | null;
        studentIdentifier: string;
        studentFirstName: string;
        studentLastName: string;
        studentEmail: string;
        degreeTitle: string;
        fieldOfStudy: string;
        grade: string | null;
        issueDate: Date;
        pdfUrl: string | null;
        pdfKey: string | null;
        revokedAt: Date | null;
        revocationReason: string | null;
        issuedById: string;
        typeId: string | null;
    })[]>;
    findOne(id: string, currentUser: any): Promise<{
        university: {
            code: string;
            name: string;
            id: string;
            logoUrl: string | null;
        };
        program: {
            code: string;
            name: string;
            id: string;
        } | null;
        academicLevel: {
            code: string;
            name: string;
            id: string;
        } | null;
        academicYear: {
            id: string;
            universityId: string;
            year: string;
        } | null;
        student: {
            email: string | null;
            id: string;
            firstName: string;
            lastName: string;
            matricule: string;
        } | null;
        template: {
            name: string;
            id: string;
            layoutConfig: Prisma.JsonValue;
        } | null;
        issuedBy: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        status: import(".prisma/client").$Enums.CertificateStatus;
        id: string;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string | null;
        programId: string | null;
        templateId: string | null;
        levelId: string | null;
        yearId: string | null;
        publicIdentifier: string;
        canonicalHash: string;
        paymentState: string;
        metadataJson: Prisma.JsonValue | null;
        studentIdentifier: string;
        studentFirstName: string;
        studentLastName: string;
        studentEmail: string;
        degreeTitle: string;
        fieldOfStudy: string;
        grade: string | null;
        issueDate: Date;
        pdfUrl: string | null;
        pdfKey: string | null;
        revokedAt: Date | null;
        revocationReason: string | null;
        issuedById: string;
        typeId: string | null;
    }>;
    verifyCertificatePublic(publicIdentifier: string, reqContext?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
        isValid: boolean;
        message: string;
        status?: undefined;
        revokedAt?: undefined;
        revocationReason?: undefined;
        certificate?: undefined;
    } | {
        isValid: boolean;
        status: "REVOKED";
        revokedAt: Date | null;
        revocationReason: string | null;
        message: string;
        certificate: {
            publicIdentifier: string;
            studentName: string;
            universityName: string;
        };
    } | {
        isValid: boolean;
        status: "PENDING" | "ISSUED" | "FAILED";
        message: string;
        certificate: {
            studentName: string;
            university: {
                code: string;
                name: string;
                id: string;
                logoUrl: string | null;
            };
            program: {
                code: string;
                name: string;
                id: string;
            } | null;
            academicLevel: {
                code: string;
                name: string;
                id: string;
            } | null;
            academicYear: {
                id: string;
                universityId: string;
                year: string;
            } | null;
            student: {
                email: string | null;
                id: string;
                firstName: string;
                lastName: string;
                matricule: string;
            } | null;
            template: {
                name: string;
                id: string;
                layoutConfig: Prisma.JsonValue;
            } | null;
            issuedBy: {
                email: string;
                id: string;
                firstName: string;
                lastName: string;
            };
            status: import(".prisma/client").$Enums.CertificateStatus;
            id: string;
            universityId: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string | null;
            programId: string | null;
            templateId: string | null;
            levelId: string | null;
            yearId: string | null;
            publicIdentifier: string;
            canonicalHash: string;
            paymentState: string;
            metadataJson: Prisma.JsonValue | null;
            studentIdentifier: string;
            studentFirstName: string;
            studentLastName: string;
            studentEmail: string;
            degreeTitle: string;
            fieldOfStudy: string;
            grade: string | null;
            issueDate: Date;
            pdfUrl: string | null;
            pdfKey: string | null;
            revokedAt: Date | null;
            revocationReason: string | null;
            issuedById: string;
            typeId: string | null;
            universityName?: undefined;
        };
        revokedAt?: undefined;
        revocationReason?: undefined;
    }>;
    revokeCertificate(certificateId: string, dto: RevokeCertificateDto, currentUser: any): Promise<{
        message: string;
        certificate: {
            id: string;
            publicIdentifier: string;
            studentName: string;
            degreeTitle: string;
            status: import(".prisma/client").$Enums.CertificateStatus;
            revocationReason: string | null;
            revokedAt: Date | null;
            universityName: string;
        };
    }>;
    private buildCanonicalString;
    private generateQrCode;
    private generatePublicIdentifier;
}
