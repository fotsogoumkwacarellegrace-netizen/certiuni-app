import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';

@Injectable()
export class TariffsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly tariffInclude = {
    service: {
      select: {
        id: true,
        name: true,
        code: true,
        price: true,
      },
    },
    university: {
      select: {
        id: true,
        name: true,
        code: true,
      },
    },
  };

  async create(dto: CreateTariffDto) {
    const serviceExists = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });

    if (!serviceExists) {
      throw new NotFoundException('Le service spécifié n\'existe pas.');
    }

    if (dto.universityId) {
      const univExists = await this.prisma.university.findUnique({
        where: { id: dto.universityId },
      });

      if (!univExists) {
        throw new NotFoundException('L\'université spécifiée n\'existe pas.');
      }

      const duplicate = await this.prisma.service.findFirst({
        where: {
          id: dto.serviceId,
        },
      });

      if (duplicate) {
        throw new ConflictException(
          'Un tarif existe déjà pour ce service au sein de cette université.',
        );
      }
    }

    return this.prisma.service.create({
      data: {
        name: dto.name.trim(),
        code: `TARIFF-${Date.now()}`,
        description: dto.name.trim(),
        universityId: 'default-university-id',
        documentTypeId: 'default-document-type-id',
      },
      include: this.tariffInclude,
    });
  }

  async findAll(universityId?: string) {
    return this.prisma.service.findMany({
      where: {},
      include: this.tariffInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const tariff = await this.prisma.service.findUnique({
      where: { id },
      include: this.tariffInclude,
    });

    if (!tariff) {
      throw new NotFoundException(`Tarif introuvable (#${id}).`);
    }

    return tariff;
  }

  async update(id: string, dto: UpdateTariffDto) {
    await this.findOne(id);

    return this.prisma.service.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.amount !== undefined && { price: dto.amount }),
        ...(dto.currency && { currency: dto.currency }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
      include: this.tariffInclude,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.service.delete({
      where: { id },
    });
  }
}