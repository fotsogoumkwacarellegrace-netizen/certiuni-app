import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Identifiants invalides ou compte inactif');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalide');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async register(registerDto: RegisterDto) {
    if (registerDto.role === Role.SUPER_ADMIN) {
      throw new BadRequestException("La création d'un Super Admin n'est pas autorisée par cette route.");
    }

    let targetUniversityId: string | null = null;

    if (registerDto.universityId) {
      const universityExists = await this.prisma.university.findUnique({
        where: { id: registerDto.universityId },
        select: { id: true },
      });

      if (universityExists) {
        targetUniversityId = registerDto.universityId;
      }
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          passwordHash: passwordHash,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          role: registerDto.role,
          universityId: targetUniversityId,
        },
      });

      const tokens = await this.generateTokens(user.id, user.email, user.role);

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

  async refreshToken(refreshTokenValue: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshTokenValue, {
        secret: refreshTokenConfig.secret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new ForbiddenException('Accès refusé');
      }

      return await this.generateTokens(user.id, user.email, user.role);
    } catch {
      throw new ForbiddenException('Jeton expiré ou invalide');
    }
  }

  async logout(userId: string) {
    return { success: true, message: 'Déconnexion réussie' };
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

  async delete(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    })
  }
}



