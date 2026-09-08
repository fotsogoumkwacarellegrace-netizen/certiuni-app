import { UserRole } from '@prisma/client';
type RoleEnum = UserRole;
export interface JwtPayload {
    sub: string;
    email: string;
    role: RoleEnum;
    universityId: string | null;
}
export declare const JWT_SECRET: string;
export declare const JWT_EXPIRES_IN = "15m";
export declare function signToken(payload: JwtPayload): string;
export declare function verifyToken(token: string): JwtPayload;
export { JwtPayload as JwtLibPayload };
