import { CertificatesService } from './certificates.service';
import { IssueCertificateDto } from './dto/issue-certificate.dto';
import { RevokeCertificateDto } from './dto/revoke-certificate.dto';
export declare class CertificatesController {
    private readonly certificatesService;
    constructor(certificatesService: CertificatesService);
    verifyPublic(publicIdentifier: string): Promise<{
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
                layoutConfig: import("@prisma/client/runtime/library").JsonValue;
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
            metadataJson: import("@prisma/client/runtime/library").JsonValue | null;
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
    verifyPublicly(identifier: string): {
        identifier: string;
        status: string;
    };
    issueCertificate(issuerId: string, dto: any): {
        message: string;
        createdBy: string;
    };
    issue(dto: IssueCertificateDto, req: any): Promise<{
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
                    layoutConfig: import("@prisma/client/runtime/library").JsonValue;
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
                metadataJson: import("@prisma/client/runtime/library").JsonValue | null;
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
    findAll(req: any): Promise<({
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
            layoutConfig: import("@prisma/client/runtime/library").JsonValue;
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
        metadataJson: import("@prisma/client/runtime/library").JsonValue | null;
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
    revoke(id: string, dto: RevokeCertificateDto, req: any): Promise<{
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
}
