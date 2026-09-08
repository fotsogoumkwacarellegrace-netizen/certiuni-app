import { z } from 'zod';
export declare const CreateUniversitySchema: z.ZodObject<{
    name: z.ZodString;
    acronym: z.ZodString;
    officialEmailDomain: z.ZodString;
    logoUrl: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    acronym: string;
    officialEmailDomain: string;
    logoUrl?: string | undefined;
    website?: string | undefined;
}, {
    name: string;
    acronym: string;
    officialEmailDomain: string;
    logoUrl?: string | undefined;
    website?: string | undefined;
}>;
export declare const UpdateUniversitySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    acronym: z.ZodOptional<z.ZodString>;
    officialEmailDomain: z.ZodOptional<z.ZodString>;
    logoUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    website: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    logoUrl?: string | undefined;
    website?: string | undefined;
    acronym?: string | undefined;
    officialEmailDomain?: string | undefined;
}, {
    name?: string | undefined;
    logoUrl?: string | undefined;
    website?: string | undefined;
    acronym?: string | undefined;
    officialEmailDomain?: string | undefined;
}>;
export type CreateUniversityDTO = z.infer<typeof CreateUniversitySchema>;
export type UpdateUniversityDTO = z.infer<typeof UpdateUniversitySchema>;
