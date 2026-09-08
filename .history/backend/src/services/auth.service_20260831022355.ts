import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import { prisma } from '../config/database';
import { redisClient } from '../config/redis';
import { env } from '../config/env';
import { UnauthorizedError, BadRequestError } from '../errors/app.error';

export class AuthService {
  /**
   * Génère un Access Token et un Refresh Token
   */
  public static generateTokens(payload: { id: string; email: string; role: string; universityId?: string | null }) {
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ id: payload.id }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Stocke le Refresh Token dans Redis avec une expiration synchronisée
   */
  public static async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const ttlInSeconds = 7 * 24 * 60 * 60; // 7 jours
    await redisClient.set(`refresh_token:${userId}`, refreshToken, 'EX', ttlInSeconds);
  }

  /**
   * Supprime le Refresh Token de Redis lors du Logout
   */
  public static async revokeRefreshToken(userId: string): Promise<void> {
    await redisClient.del(`refresh_token:${userId}`);
  }

  /**
   * Génère la clé secrète MFA et le QR code pour Google Authenticator
   */
  public static async generateMfaSecret(userEmail: string) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(userEmail, 'CertiUni', secret);
    return { secret, otpAuthUrl };
  }

  /**
   * Vérifie le code TOTP soumis
   */
  public static verifyMfaCode(token: string, secret: string): boolean {
    return authenticator.verify({ token, secret });
  }
}