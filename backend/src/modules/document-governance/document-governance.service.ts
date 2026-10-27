import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type DateFilters = { startDate?: string; endDate?: string; universityId?: string };

@Injectable()
export class DocumentGovernanceService {
  constructor(private prisma: PrismaService) {}

  async getGlobalDocumentStatistics(filters: DateFilters) {
    const where: Prisma.CertificateWhereInput = {};
    if (filters.universityId) where.universityId = filters.universityId;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {
        ...(filters.startDate ? { gte: new Date(filters.startDate) } : {}),
        ...(filters.endDate ? { lte: new Date(filters.endDate) } : {}),
      };
    }

    const [total, pending, issued, revoked, failed] = await Promise.all([
      this.prisma.certificate.count({ where }),
      this.prisma.certificate.count({ where: { ...where, status: 'PENDING' } }),
      this.prisma.certificate.count({ where: { ...where, status: 'ISSUED' } }),
      this.prisma.certificate.count({ where: { ...where, status: 'REVOKED' } }),
      this.prisma.certificate.count({ where: { ...where, status: 'FAILED' } }),
    ]);

    return { total, pending, issued, revoked, failed };
  }

  async getDocumentModels(filters: DateFilters) {
    return this.prisma.certificateTemplate.findMany({
      where: filters.universityId ? { universityId: filters.universityId } : undefined,
      include: { university: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getServiceCatalogue(filters: DateFilters) {
    return this.prisma.service.findMany({
      where: filters.universityId ? { universityId: filters.universityId } : undefined,
      include: { documentType: true, pricings: true },
      orderBy: { name: 'asc' },
    });
  }

  async getReportedIssues(filters: DateFilters) {
    const createdAt: Prisma.DateTimeFilter = {};
    if (filters.startDate) createdAt.gte = new Date(filters.startDate);
    if (filters.endDate) createdAt.lte = new Date(filters.endDate);
    return this.prisma.auditLog.findMany({
      where: {
        action: AuditAction.VERIFICATION_FAILED,
        ...(Object.keys(createdAt).length > 0 ? { createdAt } : {}),
        ...(filters.universityId ? { universityId: filters.universityId } : {}),
      },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async getTraceabilityReport(filters: DateFilters) {
    const createdAt: Prisma.DateTimeFilter = {};
    if (filters.startDate) createdAt.gte = new Date(filters.startDate);
    if (filters.endDate) createdAt.lte = new Date(filters.endDate);
    return this.prisma.auditLog.findMany({
      where: {
        ...(Object.keys(createdAt).length > 0 ? { createdAt } : {}),
        ...(filters.universityId ? { universityId: filters.universityId } : {}),
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        university: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async getLinkManagementReport(filters: DateFilters) {
    const createdAt: Prisma.DateTimeFilter = {};
    if (filters.startDate) createdAt.gte = new Date(filters.startDate);
    if (filters.endDate) createdAt.lte = new Date(filters.endDate);
    return this.prisma.document.findMany({
      where: Object.keys(createdAt).length > 0 ? { createdAt } : undefined,
      select: { id: true, hash: true, qrData: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async revokeSecureLink(linkId: string, adminId: string, reason: string) {
    if (!reason.trim()) {
      throw new BadRequestException('Le motif de révocation est requis');
    }
    const document = await this.prisma.document.findUnique({ where: { id: linkId } });
    if (!document || !document.qrData) {
      throw new NotFoundException('Lien sécurisé actif introuvable');
    }

    const [, audit] = await this.prisma.$transaction([
      this.prisma.document.update({ where: { id: linkId }, data: { qrData: null } }),
      this.prisma.auditLog.create({
        data: {
          action: AuditAction.USER_UPDATED,
          userId: adminId,
          metadata: { revokedDocumentId: linkId, reason },
        },
      }),
    ]);

    return { linkId, revoked: true, audit };
  }
}
