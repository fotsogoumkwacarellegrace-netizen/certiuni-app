export interface CertificatePdfData {
    publicIdentifier: string;
    studentName: string;
    degreeTitle: string;
    fieldOfStudy: string;
    grade: string;
    issueDate: string;
    universityName: string;
    universityLogoUrl?: string | null;
    canonicalHash: string;
    qrCodeDataUrl: string;
}
export declare const generateCertificatePdf: (data: CertificatePdfData) => Promise<Buffer>;
