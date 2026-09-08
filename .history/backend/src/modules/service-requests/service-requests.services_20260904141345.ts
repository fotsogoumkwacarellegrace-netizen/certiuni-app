import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import {
  ServiceRequestStatus,
  UpdateRequestStatusDto,
} from './dto/update-request-status.dto';

@Injectable()
export class ServiceRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly requestInclude = {
    service: true,
    student: {
      select: {
        id: true,
        matricule: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    },
    enrollment: {
      select: {
        id: true,
        academicYear: { select: { year: true } },
        program: { select: { name: true, code: true } },
      },
    },
  };

  async create(userId: string, dto: CreateRequestDto) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new BadRequestException(
        'Seuls les étudiants enregistrés peuvent soumettre une demande de service.',
      );
    }

    const service = await this.prisma.serviceCatalog.findUnique({
      where: { id: dto.serviceId },
    });

    if (!service || !service.isActive) {
      throw new NotFoundException(
        'Le service demandé n\'est pas disponible ou est inactif.',
      );
    }

    if (dto.enrollmentId) {
      const enrollment = await this.prisma.enrollment.findFirst({
        where: { id: dto.enrollmentId, studentId: student.id },
      });

      if (!enrollment) {
        throw new NotFoundException(
          'L\'inscription universitaire spécifiée n\'existe pas ou ne vous appartient pas.',
        );
      }
    }

    return this.prisma.serviceRequest.create({
      data: {
        studentId: student.id,
        serviceId: dto.serviceId,
        enrollmentId: dto.enrollmentId,
        notes: dto.notes?.trim(),
        status: ServiceRequestStatus.PENDING,
      },
      include: this.requestInclude,
    });
  }

  async findAllForStudent(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      return [];
    }

    return this.prisma.serviceRequest.findMany({
      where: { studentId: student.id },
      include: this.requestInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(status?: ServiceRequestStatus) {
    return this.prisma.serviceRequest.findMany({
      where: status ? { status } : {},
      include: this.requestInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, currentUser: { id: string; role: UserRole }) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: this.requestInclude,
    });

    if (!request) {
      throw new NotFoundException(`Demande de service introuvable (#${id}).`);
    }

    if (
      currentUser.role === UserRole.STUDENT &&
      request.student.user.id !== currentUser.id
    ) {
      throw new ForbiddenException(
        'Vous n\'avez pas la permission de consulter cette demande.',
      );
    }

    return request;
  }

  async updateStatus(id: string, dto: UpdateRequestStatusDto) {
    await this.prisma.serviceRequest.findUniqueOrThrow({
      where: { id },
      select: { id: true },
    });

    return this.prisma.serviceRequest.update({
      where: { id },
      data: {
        status: dto.status,
        adminNotes: dto.adminNotes?.trim(),
      },
      include: this.requestInclude,
    });
  }

  async cancelByStudent(id: string, userId: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: { student: true },
    });

    if (!request) {
      throw new NotFoundException(`Demande de service introuvable (#${id}).`);
    }

    if (request.student.userId !== userId) {
      throw new ForbiddenException(
        'Vous n\'êtes pas autorisé à annuler cette demande.',
      );
    }

    if (request.status !== ServiceRequestStatus.PENDING) {
      throw new BadRequestException(
        'Impossible d\'annuler une demande déjà en cours de traitement ou finalisée.',
      );
    }

    return this.prisma.serviceRequest.update({
      where: { id },
      data: { status: ServiceRequestStatus.CANCELLED },
      include: this.requestInclude,
    });
  }
}