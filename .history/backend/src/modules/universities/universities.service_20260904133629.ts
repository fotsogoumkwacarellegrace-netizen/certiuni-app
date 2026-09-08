import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';

@Injectable()
export class UniversitiesService {
  constructor(private readonly prisma: PrismaService) { }

  private readonly universitySelect = {
    id: true,
    name: true,
    code: true,
    domain: true,
    contactEmail: true,
    address: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
    _count: {
      select: {
        users: true,
        certificates: true,
      },
    },
  };

  async create(dto: CreateUniversityDto) {
    const universityCode = dto.code.toUpperCase().trim();

    const existing = await this.prisma.university.findUnique({
      where: { code: universityCode },
    });

    if (existing) {
      throw new ConflictException(
        `Une université avec le code "${universityCode}" existe déjà.`,
      );
    }

    return this.prisma.university.create({
      data: {
        name: dto.name.trim(),
        code: universityCode,
        domain: dto.domain ? dto.domain.toLowerCase().trim() : null,
        contactEmail: dto.contactEmail ? dto.contactEmail.toLowerCase().trim() : null,
        address: dto.address,
        isActive: dto.isActive ?? true,
      },
      select: this.universitySelect,
    });
  }

  async findAll() {
    return this.prisma.university.findMany({
      select: this.universitySelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const university = await this.prisma.university.findUnique({
      where: { id },
      select: this.universitySelect,
    });

    if (!university) {
      throw new NotFoundException(`Université introuvable avec l'ID #${id}.`);
    }

    return university;
  }

  async findByCode(code: string) {
    const university = await this.prisma.university.findUnique({
      where: { code: code.toUpperCase().trim() },
      select: this.universitySelect,
    });

    if (!university) {
      throw new NotFoundException(`Université introuvable avec le code "${code}".`);
    }

    return university;
  }

  async update(id: string, dto: UpdateUniversityDto) {
    await this.findOne(id);

    const updateData: any = { ...dto };

    if (dto.code) {
      updateData.code = dto.code.toUpperCase().trim();
      const existing = await this.prisma.university.findUnique({
        where: { code: updateData.code },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Le code "${updateData.code}" est déjà utilisé par une autre université.`,
        );
      }
    }

    if (dto.name) {
      updateData.name = dto.name.trim();
    }

    if (dto.domain) {
      updateData.domain = dto.domain.toLowerCase().trim();
    }

    if (dto.contactEmail) {
      updateData.contactEmail = dto.contactEmail.toLowerCase().trim();
    }

    return this.prisma.university.update({
      where: { id },
      data: updateData,
      select: this.universitySelect,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.university.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
  }
}