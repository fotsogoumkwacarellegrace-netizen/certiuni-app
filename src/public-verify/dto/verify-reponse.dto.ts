export class VerifyCertificateResponseDto {
    isValid!: boolean;
    publicIdentifier!: string;
    studentName!: string;
    degreeTitle!: string;
    fieldOfStudy!: string;
    grade!: string | null;
    issueDate!: Date;
    status!: 'ISSUED' | 'REVOKED';
    canonicalHash!: string;
    university!: {
        name: string;
        code: string;
        logoUrl?: string;
    };
    revocationReason?: string;
}