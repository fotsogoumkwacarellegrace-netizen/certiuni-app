/**
 * JWT strategy.
 *
 * Remplace `@nestjs/passport` + `passport-jwt` (PassportStrategy).
 * Les opérations de signature / vérification sont centralisées dans
 * `src/lib/jwt.ts` et réexportées ici pour garder une surface d'import
 * stable dans le domaine `auth`.
 *
 * Le middleware Express `authenticateJWT` (`src/middlewares/auth.middleware.ts`)
 * consomme `verifyToken` et injecte `req.user` (JwtPayload).
 * Le service `AuthService` consomme `signToken` pour délivrer le jeton.
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  universityId?: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_ACCESS_SECRET') ||
        configService.get<string>('jwt.access.secret') ||
        'secretKeyByDefault',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        universityId: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Utilisateur inactif ou introuvable.');
    }

    // L'objet retourné est automatiquement injecté dans req.user
    return user;
  }
}