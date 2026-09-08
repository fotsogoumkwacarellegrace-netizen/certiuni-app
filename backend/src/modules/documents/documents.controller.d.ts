import { DocumentsService } from './documents.service';
import { IssueDocumentDto } from './dto/issue-document.dto';
import { RevokeDocumentDto } from './dto/revoke-document.dto';
import { BatchIssueDocumentDto } from './dto/batch-issue-document.dto';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    issue(dto: IssueDocumentDto, req: any): Promise<{
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
            } | null;
            id: string;
            matricule: string;
        } | null;
        documentType: {
            code: string;
            name: string;
            id: string;
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publicIdentifier: string;
        canonicalHash: string;
        degreeTitle: string;
        fieldOfStudy: string;
        grade: string | null;
        issueDate: Date;
        pdfUrl: string | null;
        pdfKey: string | null;
        revokedAt: Date | null;
        revocationReason: string | null;
    }>;
    batchIssue(dto: BatchIssueDocumentDto, req: any): Promise<{
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
            } | null;
            id: string;
            matricule: string;
        } | null;
        documentType: {
            code: string;
            name: string;
            id: string;
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publicIdentifier: string;
        canonicalHash: string;
        degreeTitle: string;
        fieldOfStudy: string;
        grade: string | null;
        issueDate: Date;
        pdfUrl: string | null;
        pdfKey: string | null;
        revokedAt: Date | null;
        revocationReason: string | null;
    }[]>;
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
            } | null;
            id: string;
            matricule: string;
        } | null;
        documentType: {
            code: string;
            name: string;
            id: string;
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publicIdentifier: string;
        canonicalHash: string;
        degreeTitle: string;
        fieldOfStudy: string;
        grade: string | null;
        issueDate: Date;
        pdfUrl: string | null;
        pdfKey: string | null;
        revokedAt: Date | null;
        revocationReason: string | null;
    }>;
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
            } | null;
            id: string;
            matricule: string;
        } | null;
        documentType: {
            code: string;
            name: string;
            id: string;
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publicIdentifier: string;
        canonicalHash: string;
        degreeTitle: string;
        fieldOfStudy: string;
        grade: string | null;
        issueDate: Date;
        pdfUrl: string | null;
        pdfKey: string | null;
        revokedAt: Date | null;
        revocationReason: string | null;
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
            } | null;
            id: string;
            matricule: string;
        } | null;
        documentType: {
            code: string;
            name: string;
            id: string;
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        publicIdentifier: string;
        canonicalHash: string;
        degreeTitle: string;
        fieldOfStudy: string;
        grade: string | null;
        issueDate: Date;
        pdfUrl: string | null;
        pdfKey: string | null;
        revokedAt: Date | null;
        revocationReason: string | null;
    }>;
}
