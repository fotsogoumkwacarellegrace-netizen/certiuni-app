import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly prisma;
    constructor(jwtService: JwtService, prisma: PrismaService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    }>;
    private generateTokens;
    private updateRefreshToken;
    logout(userId: string): Promise<{
        success: boolean;
    }>;
    refreshToken(refreshTokenValue: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
