import { z } from 'zod';
export declare const IssueCertificateSchema: z.ZodObject<{
    studentIdentifier: z.ZodString;
    studentFirstName: z.ZodString;
    studentLastName: z.ZodString;
    studentEmail: z.ZodString;
    degreeTitle: z.ZodString;
    fieldOfStudy: z.ZodString;
    grade: z.ZodOptional<z.ZodString>;
    issueDate: z.ZodString;
}, "strip", z.ZodTypeAny, {
    studentIdentifier: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    degreeTitle: string;
    fieldOfStudy: string;
    issueDate: string;
    grade?: string | undefined;
}, {
    studentIdentifier: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    degreeTitle: string;
    fieldOfStudy: string;
    issueDate: string;
    grade?: string | undefined;
}>;
export declare const RevokeCertificateSchema: z.ZodObject<{
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
}, {
    reason: string;
}>;
export declare const VerifyCertificateQuerySchema: z.ZodObject<{
    identifier: z.ZodString;
}, "strip", z.ZodTypeAny, {
    identifier: string;
}, {
    identifier: string;
}>;
export type IssueCertificateDTO = z.infer<typeof IssueCertificateSchema>;
export type RevokeCertificateDTO = z.infer<typeof RevokeCertificateSchema>;
export type VerifyCertificateQueryDTO = z.infer<typeof VerifyCertificateQuerySchema>;
