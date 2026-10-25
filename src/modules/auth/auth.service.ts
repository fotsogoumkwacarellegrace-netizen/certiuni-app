import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// argon2 removed (using bcrypt)
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { env } from '../../config/env.config';
import { refreshTokenConfig } from '../../config/jwt.config';
import { RegisterDto } from '@modules/auth/dto';
import { Prisma } from '@prisma/client';
import { Role } from '@auth/decorators/roles.decorator';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) { }

  async login(loginDto: LoginDto) {
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

  async register(registerDto: RegisterDto) {
    // 1. Restriction de sécurité sur le rôle SUPER_ADMIN
    if (registerDto.role === Role.SUPER_ADMIN) {
      throw new BadRequestException("La création d'un Super Admin n'est pas autorisée par cette route.");
    }

    // 2. Vérification de l'existence de l'université
    let targetUniversityId: string | null = null;

    if (registerDto.universityId) {
      const universityExists = await this.prisma.university.findUnique({
        where: { id: registerDto.universityId },
        select: { id: true },
      });

      // Si l'université existe, on conserve son ID, sinon on laisse à null
      if (universityExists) {
        targetUniversityId = registerDto.universityId;
      }
    }

    // 3. Hashage du mot de passe
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    try {
      // 4. Création de l'utilisateur
      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          passwordHash: passwordHash,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          role: registerDto.role,
          universityId: targetUniversityId, // null si introuvable ou non fourni
        },
      });

      // 5. Génération des tokens et mise à jour du refresh token
      const tokens = await this.generateTokens(user.id, user.email, user.role);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          universityId: user.universityId,
        },
        ...tokens,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Cet email est déjà utilisé');
      }

      throw error;
    }
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: env.JWT_ACCESS_SECRET,
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshTokenConfig.secret,
        expiresIn: refreshTokenConfig.expiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hash },
    });
  }

  async logout(userId: string) {
    return { success: true };
  }

  async refreshToken(refreshTokenValue: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshTokenValue, {
        secret: refreshTokenConfig.secret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new ForbiddenException('Accès refusé');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch {
      throw new ForbiddenException('Jeton expiré ou invalide');
    }
  }
}
