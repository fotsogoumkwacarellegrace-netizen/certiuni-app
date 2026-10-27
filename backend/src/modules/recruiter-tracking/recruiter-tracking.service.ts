import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RequestStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecruiterTrackingService {
  constructor(private prisma: PrismaService) {}

  async getTreatmentQueue(recruiterId: string, status?: string) {
    const parsedStatus = this.parseStatus(status);
    return this.prisma.request.findMany({
      where: {
        handledById: recruiterId,
        ...(parsedStatus ? { status: parsedStatus } : {}),
      },
      include: {
        student: { select: { id: true, email: true, firstName: true, lastName: true } },
        service: { select: { id: true, name: true, description: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRequestForTreatment(requestId: string, recruiterId: string) {
    const request = await this.prisma.request.findFirst({
      where: { id: requestId, handledById: recruiterId },
      include: {
        student: { select: { id: true, email: true, firstName: true, lastName: true, universityId: true } },
        service: { select: { id: true, name: true, description: true, pricings: true } },
        attachedFiles: { select: { id: true, fileName: true, fileUrl: true, mimeType: true, createdAt: true } },
      },
    });

    if (!request) {
      throw new NotFoundException('Demande assignée introuvable');
    }

    return request;
  }

  async addVerificationComment(requestId: string, comment: string, recruiterId: string) {
    const request = await this.getRequestForTreatment(requestId, recruiterId);
    const note = `[${new Date().toISOString()}] Commentaire de traitement: ${comment.trim()}`;
    return this.prisma.request.update({
      where: { id: request.id },
      data: { adminNotes: [request.adminNotes, note].filter(Boolean).join('\n') },
    });
  }

  async requestAdditionalDocuments(requestId: string, requiredDocuments: string[], recruiterId: string) {
    if (requiredDocuments.length === 0 || requiredDocuments.some((document) => !document.trim())) {
      throw new BadRequestException('Au moins un document requis doit être indiqué');
    }

    const request = await this.getRequestForTreatment(requestId, recruiterId);
    const note = `[${new Date().toISOString()}] Documents complémentaires demandés: ${requiredDocuments.join(', ')}`;
    return this.prisma.request.update({
      where: { id: request.id },
      data: {
        adminNotes: [request.adminNotes, note].filter(Boolean).join('\n'),
        status: RequestStatus.IN_PROGRESS,
      },
    });
  }

  async getRequestsNeedingAttention(recruiterId: string) {
    return this.prisma.request.findMany({
      where: {
        handledById: recruiterId,
        status: { in: [RequestStatus.PENDING, RequestStatus.IN_PROGRESS] },
      },
      include: {
        student: { select: { id: true, email: true, firstName: true, lastName: true } },
        service: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  private parseStatus(status?: string): RequestStatus | undefined {
    if (!status) {
      return undefined;
    }

    if (!Object.values(RequestStatus).includes(status as RequestStatus)) {
      throw new BadRequestException('Statut de demande invalide');
    }

    return status as RequestStatus;
  }
}
