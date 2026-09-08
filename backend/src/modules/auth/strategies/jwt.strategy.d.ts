import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    universityId?: string | null;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        role: import(".prisma/client").$Enums.UserRole;
        email: string;
        id: string;
        isActive: boolean;
        universityId: string | null;
    }>;
}
export {};
