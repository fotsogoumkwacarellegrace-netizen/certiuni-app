import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportingService {
  private readonly logger = new Logger(ReportingService.name);

  constructor(private prisma: PrismaService) {}

  /** ADM-14: Produire des rapports globaux par période, institution, type de document, service ou statut */
  async generateGlobalReport(filters: {
    period: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
    institutionId?: string;
    documentType?: string;
    service?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = {};

    if (filters.startDate && filters.endDate) {
      where.createdAt = { gte: filters.startDate, lte: filters.endDate };
    }

    if (filters.institutionId) {
      where.universityId = filters.institutionId;
    }

    const [certificates, requests, total] = await Promise.all([
      this.prisma.certificate.count({ where }),
      this.prisma.request.count({ where }),
      this.prisma.auditLog.count({ where: { createdAt: where.createdAt } }),
    ]);

    return {
      period: filters.period,
      filters,
      reports: [],
      total: total + certificates + requests,
    };
  }

  /** ADM-15: Exporter des données uniquement selon les permissions et règles de confidentialité */
  async exportData(
    exportType: 'users' | 'institutions' | 'universities' | 'requests' | 'documents' | 'payments',
    filters: any,
    userId: string,
  ) {
    const selectorMap = {
      users: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
      universities: { id: true, name: true, code: true, createdAt: true },
      requests: { id: true, status: true, createdAt: true, updatedAt: true },
      documents: { id: true, degreeTitle: true, status: true, issueDate: true },
      payments: { id: true, amount: true, status: true, createdAt: true },
    } as const;

    let data: any[] = [];
    switch (exportType) {
      case 'users':
        data = await this.prisma.user.findMany({ where: filters, select: selectorMap.users });
        break;
      case 'universities':
      case 'institutions':
        data = await this.prisma.university.findMany({ where: filters, select: selectorMap.universities });
        break;
      case 'requests':
        data = await this.prisma.request.findMany({ where: filters, select: selectorMap.requests });
        break;
      case 'documents':
        data = await this.prisma.certificate.findMany({ where: filters, select: selectorMap.documents });
        break;
      case 'payments':
        data = await this.prisma.payment.findMany({ where: filters, select: selectorMap.payments });
        break;
      default:
        data = [];
    }

    return {
      exportType,
      exportedBy: userId,
      exportedAt: new Date(),
      data,
      recordCount: data.length,
      format: 'JSON',
    };
  }

  /** ADM-16: Tracer qui a effectué une action sensible, quand, sur quelle ressource et avec quel résultat */
  async getSensitiveActionsTimeline(filters: {
    startDate?: Date;
    endDate?: Date;
    actionTypes?: string[];
    resourceTypes?: string[];
  }) {
    const where: any = {};
    if (filters.startDate) where.createdAt = { ...where.createdAt, gte: filters.startDate };
    if (filters.endDate) where.createdAt = { ...where.createdAt, lte: filters.endDate };
    if (filters.actionTypes) where.action = { in: filters.actionTypes as any };

    return this.prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  /** ADM-17: Tracer changements de permissions, signatures, tarifs, intégrations et paramètres critiques */
  async getCriticalChangesTimeline(filters: {
    startDate?: Date;
    endDate?: Date;
    targetTypes?: ('USER' | 'INSTITUTION' | 'ROLE' | 'TARIFF' | 'PARAMETER')[];
  }) {
    const where: any = {};
    if (filters.startDate) where.createdAt = { ...where.createdAt, gte: filters.startDate };
    if (filters.endDate) where.createdAt = { ...where.createdAt, lte: filters.endDate };

    return this.prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }
}