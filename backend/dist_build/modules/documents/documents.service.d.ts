import { PrismaService } from '../prisma/prisma.service';
import { IssueDocumentDto } from './dto/issue-document.dto';
import { RevokeDocumentDto } from './dto/revoke-document.dto';
import { BatchIssueDocumentDto } from './dto/batch-issue-document.dto';
export declare class DocumentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly documentSelect;
    private generateCertificateNumber;
    issue(dto: IssueDocumentDto, issuerUserId: string): Promise<{
        status: import(".prisma/client").$Enums.CertificateStatus;
        university: {
            code: string;
            name: string;
            id: string;
        };
        student: {
            user: {
                email: string;
                firstName: string;
                lastName: string;
            };
            id: string;
            matricule: string;
        };
        documentType: {
            code: string;
            name: string;
            id: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publicIdentifier: string;
        canonicalHash: string;
        degreeTitle: string;
        fieldOfStudy: string;
        grade: string;
        issueDate: Date;
        pdfUrl: string;
        pdfKey: string;
        revokedAt: Date;
        revocationReason: string;
    }>;
    batchIssue(dto: BatchIssueDocumentDto, issuerUserId: string): Promise<{
        totalRequested: number;
        successfullyIssuedCount: number;
        failedCount: number;
        issuedDocuments: any[];
        errors: any[];
    }>;
    findAll(): Promise<{
        status: import(".prisma/client").$Enums.CertificateStatus;
        university: {
            code: string;
            name: string;
            id: string;
        };
        student: {
            user: {
                email: string;
                firstName: string;
                lastName: string;
            };
            id: string;
            matricule: string;
        };
        documentType: {
            code: string;
            name: string;
            id: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publicIdentifier: string;
        canonicalHash: string;
        degreeTitle: string;
        fieldOfStudy: string;
        grade: string;
        issueDate: Date;
        pdfUrl: string;
        pdfKey: string;
        revokedAt: Date;
        revocationReason: string;
    }[]>;
    findOne(id: string): Promise<{
        status: import(".prisma/client").$Enums.CertificateStatus;
        university: {
            code: string;
            name: string;
            id: string;
        };
        student: {
            user: {
                email: string;
                firstName: string;
                lastName: string;
            };
            id: string;
            matricule: string;
        };
        documentType: {
            code: string;
            name: string;
            id: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publicIdentifier: string;
        canonicalHash: string;
        degreeTitle: string;
        fieldOfStudy: string;
        grade: string;
        issueDate: Date;
        pdfUrl: string;
        pdfKey: string;
        revokedAt: Date;
        revocationReason: string;
    }>;
    findByNumber(certificateNumber: string): Promise<{
        status: import(".prisma/client").$Enums.CertificateStatus;
        university: {
            code: string;
            name: string;
            id: string;
        };
        student: {
            user: {
                email: string;
                firstName: string;
                lastName: string;
            };
            id: string;
            matricule: string;
        };
        documentType: {
            code: string;
            name: string;
            id: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publicIdentifier: string;
        canonicalHash: string;
        degreeTitle: string;
        fieldOfStudy: string;
        grade: string;
        issueDate: Date;
        pdfUrl: string;
        pdfKey: string;
        revokedAt: Date;
        revocationReason: string;
    }>;
    revoke(id: string, dto: RevokeDocumentDto): Promise<{
        status: import(".prisma/client").$Enums.CertificateStatus;
        university: {
            code: string;
            name: string;
            id: string;
        };
        student: {
            user: {
                email: string;
                firstName: string;
                lastName: string;
            };
            id: string;
            matricule: string;
        };
        documentType: {
            code: string;
            name: string;
            id: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publicIdentifier: string;
        canonicalHash: string;
        degreeTitle: string;
        fieldOfStudy: string;
        grade: string;
        issueDate: Date;
        pdfUrl: string;
        pdfKey: string;
        revokedAt: Date;
        revocationReason: string;
    }>;
}
