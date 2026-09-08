import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RefreshTokenDto } from './dto/login.dto';
import { env } from '../config/env.config';
import { refreshTokenConfig } from '../config/jwt.config';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) { }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Ligne 22 corrigée :
    const isPasswordValid = await argon2.verify(user.passwordHash, loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      ...tokens,
    };
  }

  async generateTokens(payload: { sub: string; email: string; role: string }) {
    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshTokenConfig.secret,
      expiresIn: refreshTokenConfig.expiresIn,
    });
    return {
      accessToken,
      refreshToken,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string) {
    const hashedToken = await argon2.hash(token);
    // await this.prisma.refreshToken.create({
    //   data: {
    //     token: hashedToken,
    //     userId: userId,
    //     expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
    //   },
    // });
  }

  
}