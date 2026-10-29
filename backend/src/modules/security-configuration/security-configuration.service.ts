import { Injectable, Logger } from '@nestjs/common';
import { AuditAction } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SecurityConfigurationService {
  private readonly logger = new Logger(SecurityConfigurationService.name);

  constructor(private prisma: PrismaService) {}

  async getServicesStatus() {
    return [
      { service: 'IA & Stockage', status: 'OPERATIONNEL', details: null },
      { service: 'Notifications', status: 'OPERATIONNEL', details: null },
      { service: 'API & Webhooks', status: 'OPERATIONNEL', details: null },
    ];
  }

  async getTechnicalAlerts(filters: {
    startDate?: Date;
    endDate?: Date;
    service?: string;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }) {
    const where: any = {};
    if (filters.startDate) where.createdAt = { ...where.createdAt, gte: filters.startDate };
    if (filters.endDate) where.createdAt = { ...where.createdAt, lte: filters.endDate };
    if (filters.service) where.metadata = { path: ['service'], string_contains: filters.service };
    return this.prisma.auditLog.findMany({ where, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async getPaymentSummary(filters: {
    startDate?: Date;
    endDate?: Date;
    provider?: string;
    status?: 'SUCCEEDED' | 'FAILED' | 'REFUNDED' | 'PENDING';
  }) {
    const where: any = {};
    if (filters.startDate) where.createdAt = { ...where.createdAt, gte: filters.startDate };
    if (filters.endDate) where.createdAt = { ...where.createdAt, lte: filters.endDate };
    if (filters.provider) where.provider = filters.provider;
    if (filters.status) where.status = filters.status;

    return this.prisma.payment.findMany({
      where,
      include: { student: { select: { id: true, firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async getPaymentProvidersStatus() {
    return [];
  }

  async getAuditLogs(filters: {
    startDate?: Date;
    endDate?: Date;
    action?: string;
    adminId?: string;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }) {
    const where: any = {};
    if (filters.startDate) where.createdAt = { ...where.createdAt, gte: filters.startDate };
    if (filters.endDate) where.createdAt = { ...where.createdAt, lte: filters.endDate };
    if (filters.action) where.action = filters.action;
    if (filters.adminId) where.userId = filters.adminId;

    return this.prisma.auditLog.findMany({
      where,
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async getBackupStatus() {
    return [];
  }

  async getGlobalParameters() {
    return [];
  }

  async updateGlobalParameter(key: string, value: any, adminId: string) {
    const audit = await this.prisma.auditLog.create({
      data: {
        action: AuditAction.USER_UPDATED,
        userId: adminId,
        metadata: { key, value },
      },
    });

    this.logger.log(`Paramètre global ${key} mis à jour par admin ${adminId}`);
    return { parameter: { key, value }, audit };
  }
}
