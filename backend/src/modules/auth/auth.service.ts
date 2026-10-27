import {
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, timingSafeEqual } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { env, requireJwtAccessSecret, requireJwtRefreshSecret } from '../../config/env.config';
import { refreshTokenConfig } from '../../config/jwt.config';
import { AuthProvider } from '../integrations/providers/auth/auth-provider.interface';
import { MfaService } from './mfa.service';

@Injectable()
export class AuthService implements AuthProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly mfaService: MfaService,
  ) { }

  get configured(): boolean {
    return Boolean(env.JWT_ACCESS_SECRET && env.JWT_REFRESH_SECRET);
  }

  async login(loginDto: LoginDto) {
    if (!env.JWT_ACCESS_SECRET || !env.JWT_REFRESH_SECRET) {
      throw new ServiceUnavailableException({
        error: 'not_configured',
        feature: 'jwt',
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Si MFA est activé, on ne retourne pas les tokens directement :
    // le client doit d'abord valider un code TOTP via POST /auth/mfa/verify
    if (user.isMfaEnabled) {
      return {
        mfaRequired: true,
        userId: user.id,
        email: user.email,
        message: 'Code TOTP requis pour terminer l\'authentification.',
      };
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

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

  /** Termine l'authentification 2FA : vérifie le code TOTP et émet les tokens JWT */
  async completeMfaLogin(userId: string, token: string) {
    const user = await this.mfaService.verifyTokenAndGetUser(userId, token);

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

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

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const accessSecret = requireJwtAccessSecret();
    const refreshSecret = requireJwtRefreshSecret();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshTokenConfig.expiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string | null) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokenHash: refreshToken ? this.hashRefreshToken(refreshToken) : null,
      },
    });
  }

  async logout(userId: string) {
    await this.updateRefreshToken(userId, null);
    return { success: true };
  }

  async refreshToken(refreshTokenValue: string) {
    if (!env.JWT_REFRESH_SECRET) {
      throw new ServiceUnavailableException({
        error: 'not_configured',
        feature: 'jwt-refresh',
      });
    }

    let payload: { sub?: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshTokenValue, {
        secret: requireJwtRefreshSecret(),
      });
    } catch {
      throw new ForbiddenException('Jeton expiré ou invalide');
    }

    if (!payload.sub) {
      throw new ForbiddenException('Jeton expiré ou invalide');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (
      !user?.refreshTokenHash ||
      !this.matchesRefreshToken(refreshTokenValue, user.refreshTokenHash)
    ) {
      throw new ForbiddenException('Jeton expiré ou invalide');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private hashRefreshToken(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('hex');
  }

  private matchesRefreshToken(refreshToken: string, storedHash: string): boolean {
    const expected = Buffer.from(storedHash, 'hex');
    const actual = Buffer.from(this.hashRefreshToken(refreshToken), 'hex');
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }
}