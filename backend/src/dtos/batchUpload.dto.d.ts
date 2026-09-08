import { z } from 'zod';
export declare const BatchUploadSchema: z.ZodObject<{
    universityId: z.ZodString;
    fileName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    universityId: string;
    fileName: string;
}, {
    universityId: string;
    fileName: string;
}>;
export type BatchUploadDTO = z.infer<typeof BatchUploadSchema>;
