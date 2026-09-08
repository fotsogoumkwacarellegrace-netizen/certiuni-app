import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTemplateDto, user: any) {
    const targetUniversityId =
      user.role === UserRole.SUPER_ADMIN ? dto.universityId : user.universityId;

    if (!targetUniversityId) {
      throw new ForbiddenException("L'ID de l'université est requis pour créer un modèle.");
    }

    const universityExists = await this.prisma.university.findUnique({
      where: { id: targetUniversityId },
    });

    if (!universityExists) {
      throw new NotFoundException('Université introuvable.');
    }

    return this.prisma.certific.create({
      data: {
        name: dto.name,
        description: dto.description,
        layoutConfig: dto.layoutConfig,
        universityId: targetUniversityId,
      },
      include: {
        university: {
          select: { id: true, name: true, code: true },
        },
      },
    });
  }

  async findAll(user: any) {
    const whereCondition =
      user.role === UserRole.SUPER_ADMIN
        ? {}
        : { universityId: user.universityId };

    return this.prisma.certificateTemplate.findMany({
      where: whereCondition,
      include: {
        university: {
          select: { id: true, name: true, code: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, user: any) {
    const template = await this.prisma.certificateTemplate.findUnique({
      where: { id },
      include: {
        university: {
          select: { id: true, name: true, code: true },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Modèle introuvable avec l'ID "${id}".`);
    }

    if (user.role !== UserRole.SUPER_ADMIN && template.universityId !== user.universityId) {
      throw new ForbiddenException("Accès non autorisé à ce modèle de diplôme.");
    }

    return template;
  }

  async update(id: string, dto: UpdateTemplateDto, user: any) {
    await this.findOne(id, user);

    return this.prisma.certificateTemplate.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.layoutConfig && { layoutConfig: dto.layoutConfig }),
      },
    });
  }

  async remove(id: string, user: any) {
    await this.findOne(id, user);

    return this.prisma.certificateTemplate.delete({
      where: { id },
    });
  }
}