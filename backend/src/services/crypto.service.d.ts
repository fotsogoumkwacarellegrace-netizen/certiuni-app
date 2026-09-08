export interface CanonicalCertificateInput {
    studentIdentifier: string;
    degreeTitle: string;
    issueDate: string | Date;
    universityId: string;
}
export declare class CryptoService {
    static calculateCanonicalHash(payload: {
        studentIdentifier: string;
        degreeTitle: string;
        issueDate: string;
        universityId: string;
    }): string;
    static calculateBufferHash(buffer: Buffer): string;
    static verifyHash(data: CanonicalCertificateInput, expectedHash: string): boolean;
}
