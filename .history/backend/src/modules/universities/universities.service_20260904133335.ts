import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';

@Injectable()
export class UniversitiesService {
  constructor(private readonly prisma: PrismaService) {}

  
  async create(dto: CreateUniversityDto) {
    const existing = await this.prisma.university.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException(`Une université avec le code "${dto.code}" existe déjà.`);
    }

    return this.prisma.university.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.university.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const university = await this.prisma.university.findUnique({
      where: { id },
    });

    if (!university) {
      throw new NotFoundException(`Université introuvable`);
    }

    return university;
  }

  async update(id: string, dto: UpdateUniversityDto) {
    await this.findOne(id);
    return this.prisma.university.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.university.delete({
      where: { id },
    });
  }
}