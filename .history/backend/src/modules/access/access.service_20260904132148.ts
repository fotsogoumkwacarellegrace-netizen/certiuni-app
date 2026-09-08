import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CheckAccessDto } from './dto/check-access.dto';

@Injectable()
export class AccessService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Évalue dynamiquement si un utilisateur possède la permission requise et appartient au bon tenant.
     */
    async checkAccess(dto: CheckAccessDto): Promise<{ isAllowed: boolean; reason?: string }> {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId },
            select: {
                id: true,
                role: true,
                universityId: true,
                isActive: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`Utilisateur avec l'ID #${dto.userId} introuvable.`);
        }

        if (!user.isActive) {
            return { isAllowed: false, reason: 'Le compte utilisateur est désactivé.' };
        }

        // Le SUPER_ADMIN dispose d'un accès global inconditionnel
        if (user.role === UserRole.SUPER_ADMIN) {
            return { isAllowed: true };
        }

        // Vérification de la portée multi-tenant par université
        if (dto.universityId && user.universityId !== dto.universityId) {
            return {
                isAllowed: false,
                reason: 'L\'utilisateur n\'appartient pas à l\'université ciblée par cette opération.',
            };
        }

        // Récupération du rôle et de ses permissions associées
        const roleRecord = await this.prisma.role.findFirst({
            where: { name: user.role.toString() },
            select: { permissions: true },
        });

        if (!roleRecord) {
            return { isAllowed: false, reason: 'Aucun profil de rôle correspondant n\'a été trouvé.' };
        }

        const hasPermission = roleRecord.permissions.includes(dto.permission.toLowerCase().trim());

        if (!hasPermission) {
            return {
                isAllowed: false,
                reason: `La permission "${dto.permission}" n'est pas accordée à ce rôle.`,
            };
        }

        return { isAllowed: true };
    }

    /**
     * Retourne l'ensemble des permissions et droits actifs calculés pour un utilisateur donné.
     */
    async getUserEffectivePermissions(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                role: true,
                universityId: true,
                isActive: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`Utilisateur introuvable.`);
        }

        if (user.role === UserRole.SUPER_ADMIN) {
            const allPermissions = await this.prisma.permission.findMany({ select: { name: true } });
            return {
                userId: user.id,
                role: user.role,
                isSuperAdmin: true,
                permissions: allPermissions.map((p) => p.name),
            };
        }

        const roleRecord = await this.prisma.role.findFirst({
            where: { name: user.role.toString() },
            select: { permissions: true },
        });

        return {
            userId: user.id,
            role: user.role,
            universityId: user.universityId,
            isSuperAdmin: false,
            permissions: roleRecord?.permissions || [],
        };
    }
}