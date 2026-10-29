import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AuditAction, Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InstitutionService {
  private readonly logger = new Logger(InstitutionService.name);

  constructor(private prisma: PrismaService) {}

  async getAllUsers(filters: {
    role?: UserRole;
    status?: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'REJECTED';
    universityId?: string;
    search?: string;
  }) {
    const where: Prisma.UserWhereInput = {};

    if (filters.role) where.role = filters.role;
    if (filters.status === 'ACTIVE') where.isActive = true;
    if (filters.status === 'SUSPENDED' || filters.status === 'REJECTED') where.isActive = false;
    if (filters.universityId) where.universityId = filters.universityId;
    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.user.findMany({
      where,
      include: { university: { select: { id: true, name: true, code: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async toggleAccountStatus(
    userId: string,
    status: 'ACTIVE' | 'SUSPENDED' | 'REJECTED',
    adminId: string,
    reason: string,
  ) {
    const isActive = status === 'ACTIVE';
    const [account, audit] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { isActive },
        include: { university: { select: { name: true } } },
      }),
      this.prisma.auditLog.create({
        data: {
          action: AuditAction.USER_UPDATED,
          userId: adminId,
          metadata: { targetUserId: userId, status, reason },
        },
      }),
    ]);

    this.logger.log(`Compte ${userId} mis à jour vers ${status} par admin ${adminId}`);
    return { account, audit };
  }

  async reviewInstitutionRegistration(
    registrationId: string,
    adminId: string,
    action: 'APPROVE' | 'REFUSE' | 'SUSPEND',
    justification: string,
  ) {
    const university = await this.prisma.university.findUnique({ where: { id: registrationId } });
    if (!university) {
      throw new NotFoundException('Inscription institutionnelle introuvable');
    }

    const [updated, audit] = await this.prisma.$transaction([
      this.prisma.university.update({
        where: { id: registrationId },
        data: { isVerified: action === 'APPROVE' },
      }),
      this.prisma.auditLog.create({
        data: {
          action: AuditAction.UNIVERSITY_UPDATED,
          userId: adminId,
          universityId: registrationId,
          metadata: { reviewAction: action, justification },
        },
      }),
    ]);

    this.logger.log(`Inscription institutionnelle ${registrationId} ${action} par admin ${adminId}`);
    return { registration: updated, audit };
  }

  async manageGlobalRoles(
    adminId: string,
    action: 'GRANT' | 'REVOKE',
    targetType: 'USER' | 'INSTITUTION',
    targetId: string,
    role: UserRole,
    permissions: string[],
  ) {
    if (targetType !== 'USER') {
      throw new BadRequestException('Les rôles par institution ne sont pas pris en charge par le schéma actuel');
    }
    if (action !== 'GRANT') {
      throw new BadRequestException('Un rôle utilisateur est obligatoire; attribuez un rôle de remplacement');
    }

    const [account, audit] = await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: targetId }, data: { role } }),
      this.prisma.auditLog.create({
        data: {
          action: AuditAction.USER_UPDATED,
          userId: adminId,
          metadata: { targetUserId: targetId, role, permissions, roleAction: action },
        },
      }),
    ]);

    this.logger.log(`Rôle ${role} attribué à ${targetId} par admin ${adminId}`);
    return { account, audit };
  }

  async getSecurityEvents(filters: {
    startDate?: Date;
    endDate?: Date;
    action?: string;
    userId?: string;
  }) {
    const where: Prisma.AuditLogWhereInput = {};
    if (filters.startDate || filters.endDate) {
      where.createdAt = {
        ...(filters.startDate ? { gte: filters.startDate } : {}),
        ...(filters.endDate ? { lte: filters.endDate } : {}),
      };
    }
    if (filters.action && Object.values(AuditAction).includes(filters.action as AuditAction)) {
      where.action = filters.action as AuditAction;
    }
    if (filters.userId) where.userId = filters.userId;

    return this.prisma.auditLog.findMany({
      where,
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async configureSecuritySettings(
    settings: {
      requireMFA: boolean;
      maxFailedLoginAttempts: number;
      sessionTimeoutMinutes: number;
      ipRestriction: boolean;
      allowedIPs?: string[];
    },
    adminId: string,
  ) {
    const audit = await this.prisma.auditLog.create({
      data: {
        action: AuditAction.USER_UPDATED,
        userId: adminId,
        metadata: { securitySettings: settings },
      },
    });

    this.logger.log(`Paramètres de sécurité configurés par admin ${adminId}`);
    return { settings, audit };
  }
}
