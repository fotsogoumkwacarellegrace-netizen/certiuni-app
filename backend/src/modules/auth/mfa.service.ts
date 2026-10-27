import {
    Injectable,
    Logger,
    UnauthorizedException,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { env } from '../../config/env.config';

const ISSUER = 'CertiUni';

export interface EnrollmentData {
    userId: string;
    secret: string;
    otpauthUrl: string;
    qrCodeDataUrl: string;
}

@Injectable()
export class MfaService {
    private readonly logger = new Logger(MfaService.name);

    private pendingEnrollments = new Map<string, EnrollmentData & { expiresAt: number }>();

    constructor(private readonly prisma: PrismaService) { }

    async enrollStart(userId: string, email: string): Promise<EnrollmentData> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Utilisateur introuvable.');
        }

        const secret = speakeasy.generateSecret({
            name: `${ISSUER}:${email}`,
            issuer: ISSUER,
            length: 32,
        }).base32;

        const otpauthUrl = speakeasy.otpauthURL({
            secret,
            label: email,
            issuer: ISSUER,
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
        });

        const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });

        this.pendingEnrollments.set(userId, {
            userId,
            secret,
            otpauthUrl,
            qrCodeDataUrl,
            expiresAt: Date.now() + 10 * 60 * 1000,
        });

        this.logger.log(`Enrôlement MFA démarré pour l'utilisateur #${userId}`);

        return { userId, secret, otpauthUrl, qrCodeDataUrl };
    }

    async confirmEnroll(userId: string, token: string): Promise<{ verified: boolean }> {
        const pending = this.pendingEnrollments.get(userId);
        if (!pending) {
            throw new BadRequestException('Aucun enrôlement MFA en cours pour cet utilisateur.');
        }

        if (Date.now() > pending.expiresAt) {
            this.pendingEnrollments.delete(userId);
            throw new BadRequestException("L'enrôlement MFA a expiré. Veuillez recommencer.");
        }

        const isValid = speakeasy.totp.verify({
            secret: pending.secret,
            encoding: 'base32',
            token,
        });

        if (!isValid) {
            throw new UnauthorizedException('Code TOTP invalide.');
        }

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                mfaSecret: pending.secret,
                isMfaEnabled: true,
            },
        });

        this.pendingEnrollments.delete(userId);

        this.logger.log(`MFA activé pour l'utilisateur #${userId}`);
        return { verified: true };
    }

    async verifyToken(userId: string, token: string): Promise<{ verified: boolean }> {
        await this.verifyTokenAndGetUser(userId, token);
        return { verified: true };
    }

    /** Vérifie le code TOTP et retourne l'utilisateur associé (utilisé pour le login 2FA) */
    async verifyTokenAndGetUser(userId: string, token: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Utilisateur introuvable.');
        }
        if (!user.isMfaEnabled || !user.mfaSecret) {
            throw new UnauthorizedException('Le MFA n\'est pas activé pour cet utilisateur.');
        }

        const isValid = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token,
        });

        if (!isValid) {
            throw new UnauthorizedException('Code TOTP invalide.');
        }

        return user;
    }

    /** Désactive le MFA pour un utilisateur */
    async disable(userId: string): Promise<{ disabled: boolean }> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Utilisateur introuvable.');
        }

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                mfaSecret: null,
                isMfaEnabled: false,
            },
        });

        this.logger.log(`MFA désactivé pour l'utilisateur #${userId}`);
        return { disabled: true };
    }

    /** Retourne true si le MFA est activé pour l'utilisateur */
    async isMfaEnabled(userId: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { isMfaEnabled: true },
        });
        return Boolean(user?.isMfaEnabled);
    }
}