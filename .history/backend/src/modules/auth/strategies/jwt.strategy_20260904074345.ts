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
import { UsersService } from '../../users/users.service';
import { env } from '../../config/env.config';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'secretKeyByDefault'),
    });
  }

  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé ou session invalide');
    }
    // L'objet retourné est injecté automatiquement dans req.user
    return user;
  }
}

