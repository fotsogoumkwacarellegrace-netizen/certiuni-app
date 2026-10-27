import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UniversityProgramsService {
  constructor(private prisma: PrismaService) {}

  async getAllPrograms(universityId?: string) {
    return this.prisma.program.findMany({
      where: universityId ? { universityId } : undefined,
      include: {
        university: { select: { id: true, name: true } },
        _count: { select: { students: true, enrollments: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getProgramById(programId: string) {
    const program = await this.prisma.program.findUnique({
      where: { id: programId },
      include: {
        university: { select: { id: true, name: true } },
        enrollments: true,
        _count: { select: { students: true, certificates: true } },
      },
    });
    if (!program) throw new NotFoundException('Programme introuvable');
    return program;
  }

  async createProgram(
    universityId: string,
    data: { name: string; code: string; description?: string },
  ) {
    return this.prisma.program.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        university: { connect: { id: universityId } },
      },
    });
  }

  async updateProgram(programId: string, data: { name?: string; code?: string; description?: string }) {
    return this.prisma.program.update({ where: { id: programId }, data });
  }

  async deleteProgram(programId: string) {
    return this.prisma.program.delete({ where: { id: programId } });
  }

  async getProgramLevels(programId: string) {
    const program = await this.prisma.program.findUnique({
      where: { id: programId },
      select: { universityId: true },
    });
    if (!program) throw new NotFoundException('Programme introuvable');

    return this.prisma.academicLevel.findMany({
      where: { universityId: program.universityId },
      orderBy: { code: 'asc' },
    });
  }

  async createAcademicLevel(programId: string, data: { name: string; level: number }) {
    const program = await this.prisma.program.findUnique({
      where: { id: programId },
      select: { universityId: true },
    });
    if (!program) throw new NotFoundException('Programme introuvable');

    return this.prisma.academicLevel.create({
      data: {
        name: data.name,
        code: String(data.level),
        university: { connect: { id: program.universityId } },
      },
    });
  }

  async getUniversityStats(universityId: string) {
    const [totalPrograms, totalStudents, totalGraduates] = await Promise.all([
      this.prisma.program.count({ where: { universityId } }),
      this.prisma.enrollment.count({ where: { student: { universityId }, status: 'ACTIVE' } }),
      this.prisma.certificate.count({ where: { universityId, status: 'ISSUED' } }),
    ]);

    return { totalPrograms, totalStudents, totalGraduates };
  }
}
