import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service'; // Votre service Prisma
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valide les identifiants et génère un jeton d'accès JWT
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Recherche de l'utilisateur par son email
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides (email introuvable)');
    }

    // 2. Vérification du mot de passe hashé
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides (mot de passe incorrect)');
    }

    // 3. Construction du Payload du JWT (Inclusion des informations de Tenant)
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      universityId: user.universityId,
    };

    // 4. Génération du Jeton JWT
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        universityId: user.universityId,
        universityName: user.university?.name || null,
      },
    };
  }

  /**
   * Valide le payload décodé depuis le filtre JWT Passport
   */
  async validateUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        universityId: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur inexistant ou révoqué');
    }

    return user;
  }
}