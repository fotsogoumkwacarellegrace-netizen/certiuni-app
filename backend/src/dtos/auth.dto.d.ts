import { z } from 'zod';
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    mfaCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    mfaCode?: string | undefined;
}, {
    email: string;
    password: string;
    mfaCode?: string | undefined;
}>;
export declare const RegisterUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodEnum<["SUPER_ADMIN", "UNIV_ADMIN", "ISSUER", "VERIFIER"]>;
    universityId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    role: "SUPER_ADMIN" | "ISSUER" | "VERIFIER" | "UNIV_ADMIN";
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    universityId?: string | undefined;
}, {
    role: "SUPER_ADMIN" | "ISSUER" | "VERIFIER" | "UNIV_ADMIN";
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    universityId?: string | undefined;
}>;
export declare const RefreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export declare const EnableMfaSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
export type LoginDTO = z.infer<typeof LoginSchema>;
export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;
export type RefreshTokenDTO = z.infer<typeof RefreshTokenSchema>;
export type EnableMfaDTO = z.infer<typeof EnableMfaSchema>;
