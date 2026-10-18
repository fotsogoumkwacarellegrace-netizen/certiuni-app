import jwt, { JwtPayload as JwtLibPayload, SignOptions } from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
type RoleEnum = UserRole;

/**
 * Contrat du JWT (payload signé).
 * Aligné sur la charge utile construite par `AuthService.login` et décodée
 * par le middleware `authenticateJWT`.
 */
export interface JwtPayload {
  sub: string; // id de l'utilisateur (UUID)
  email: string;
  role: RoleEnum;
  universityId: string | null;
}

// Remplace @nestjs/jwt (JwtService) et la configuration PassportStrategy.
export const JWT_SECRET =
  process.env.JWT_SECRET || 'super_secret_certiuni_key_2026';
export const JWT_EXPIRES_IN = '15m'; // durée de vie courte, conformément à la doc sécurité

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

// Re-exporté pour garder un point d'import stable depuis `auth/strategies/jwt.strategy.ts`.
export { JwtPayload as JwtLibPayload };
