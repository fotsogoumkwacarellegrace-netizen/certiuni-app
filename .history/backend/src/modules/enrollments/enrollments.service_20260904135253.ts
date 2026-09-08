import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentStatusDto } from './dto/update-enrollment-status.dto';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly enrollmentSelect = {
    id: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    student: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    },
    program: {
      select: {
        id: true,
        name: true,
        code: true,
      },
    },
    academicLevel: {
      select: {
        id: true,
        name: true,
        code: true,
      },
    },
    academicYear: {
      select: {
        id: true,
        year: true,
        isCurrent: true,
      },
    },
  };

  async create(dto: CreateEnrollmentDto) {
    const { studentId, programId, academicLevelId, academicYearId } = dto;

    // 1. Vérifier l'existence des entités reliées
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Étudiant introuvable avec l'ID #${studentId}.`);
    }

    const program = await this.prisma.program.findUnique({
      where: { id: programId },
    });
    if (!program) {
      throw new NotFoundException(`Filière introuvable avec l'ID #${programId}.`);
    }

    const academicLevel = await this.prisma.academicLevel.findUnique({
      where: { id: academicLevelId },
    });
    if (!academicLevel) {
      throw new NotFoundException(`Niveau académique introuvable avec l'ID #${academicLevelId}.`);
    }

    const academicYear = await this.prisma.academicYear.findUnique({
      where: { id: academicYearId },
    });
    if (!academicYear) {
      throw new NotFoundException(`Année académique introuvable avec l'ID #${academicYearId}.`);
    }

    // 2. Prévenir les inscriptions en double pour une même année académique
    const existingEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId,
        academicYearId,
      },
    });

    if (existingEnrollment) {
      throw new ConflictException(
        'Cet étudiant est déjà inscrit pour cette année académique.',
      );
    }

    return this.prisma.enrollment.create({
      data: {
        studentId,
        programId,
        academicLevelId,
        academicYearId,
      },
      select: this.enrollmentSelect,
    });
  }

  async findAll() {
    return this.prisma.enrollment.findMany({
      select: this.enrollmentSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      select: this.enrollmentSelect,
    });

    if (!enrollment) {
      throw new NotFoundException(`Inscription introuvable avec l'ID #${id}.`);
    }

    return enrollment;
  }

  async findByStudent(studentId: string) {
    return this.prisma.enrollment.findMany({
      where: { studentId },
      select: this.enrollmentSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByProgramAndYear(programId: string, academicYearId: string) {
    return this.prisma.enrollment.findMany({
      where: { programId, academicYearId },
      select: this.enrollmentSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, dto: UpdateEnrollmentStatusDto) {
    await this.findOne(id);

    return this.prisma.enrollment.update({
      where: { id },
      data: { status: dto.status },
      select: this.enrollmentSelect,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.enrollment.delete({
      where: { id },
      select: {
        id: true,
        status: true,
      },
    });
  }
}