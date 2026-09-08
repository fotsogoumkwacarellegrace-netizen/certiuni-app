export interface CreateCertificateDto {
    universityId: string;
    studentId: string;
    degreeType: string;
    fieldOfStudy: string;
    issueDate: string;
    pdfS3Key?: string;
}
