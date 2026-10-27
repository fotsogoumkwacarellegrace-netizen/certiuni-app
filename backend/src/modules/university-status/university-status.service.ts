import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction, Prisma, RequestStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UniversityStatusService {
  constructor(private prisma: PrismaService) {}

  async getRequestStatusHistory(requestId: string) {
    return this.prisma.auditLog.findMany({
      where: {
        action: AuditAction.REQUEST_UPDATED,
        metadata: { path: ['requestId'], equals: requestId },
      },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateRequestStatus(requestId: string, newStatus: string, changedBy: string, comment?: string) {
    if (!Object.values(RequestStatus).includes(newStatus as RequestStatus)) {
      throw new BadRequestException('Statut de demande invalide');
    }

    const request = await this.prisma.request.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundException('Demande introuvable');

    const status = newStatus as RequestStatus;
    const [updatedRequest, statusHistory] = await this.prisma.$transaction([
      this.prisma.request.update({
        where: { id: requestId },
        data: { status },
        include: {
          student: { select: { id: true, email: true, firstName: true, lastName: true } },
          service: { select: { id: true, name: true } },
        },
      }),
      this.prisma.auditLog.create({
        data: {
          action: AuditAction.REQUEST_UPDATED,
          userId: changedBy,
          metadata: {
            requestId,
            fromStatus: request.status,
            toStatus: status,
            comment: comment ?? null,
          } as Prisma.InputJsonObject,
        },
      }),
    ]);

    return { request: updatedRequest, statusHistory };
  }

  async getPendingRequestsByUniversity(universityId: string) {
    return this.prisma.request.findMany({
      where: { student: { universityId }, status: RequestStatus.PENDING },
      include: {
        student: { select: { id: true, email: true, firstName: true, lastName: true } },
        service: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRequestStatusStats(universityId: string) {
    const where = { student: { universityId } };
    const [pending, processing, approved, rejected] = await Promise.all([
      this.prisma.request.count({ where: { ...where, status: RequestStatus.PENDING } }),
      this.prisma.request.count({ where: { ...where, status: RequestStatus.IN_PROGRESS } }),
      this.prisma.request.count({ where: { ...where, status: RequestStatus.APPROVED } }),
      this.prisma.request.count({ where: { ...where, status: RequestStatus.REJECTED } }),
    ]);

    return { pending, processing, approved, rejected };
  }

  async getStudentRequestHistory(studentId: string) {
    return this.prisma.request.findMany({
      where: { studentId },
      include: { service: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
