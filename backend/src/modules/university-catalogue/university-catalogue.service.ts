import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type ServiceDetails = {
  name?: string;
  code?: string;
  description?: string;
  documentTypeId?: string;
  price?: number;
  currency?: string;
};

@Injectable()
export class UniversityCatalogueService {
  constructor(private prisma: PrismaService) {}

  async getAllServices(universityId?: string) {
    return this.prisma.service.findMany({
      where: universityId ? { universityId } : undefined,
      include: { documentType: true, pricings: true },
      orderBy: { name: 'asc' },
    });
  }

  async getServiceById(serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: { documentType: true, pricings: true },
    });

    if (!service) {
      throw new NotFoundException('Service introuvable');
    }

    return service;
  }

  async createService(
    universityId: string,
    data: ServiceDetails & { name: string; code: string; documentTypeId: string },
  ) {
    const createData: Prisma.ServiceCreateInput = {
      name: data.name,
      code: data.code,
      description: data.description,
      university: { connect: { id: universityId } },
      documentType: { connect: { id: data.documentTypeId } },
    };

    if (data.price !== undefined) {
      createData.pricings = {
        create: {
          amount: data.price,
          currency: data.currency ?? 'XAF',
          university: { connect: { id: universityId } },
        },
      };
    }

    return this.prisma.service.create({
      data: createData,
      include: { documentType: true, pricings: true },
    });
  }

  async updateService(serviceId: string, data: ServiceDetails) {
    const existing = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: { pricings: { take: 1 } },
    });

    if (!existing) {
      throw new NotFoundException('Service introuvable');
    }

    const { price, currency, ...serviceData } = data;
    return this.prisma.$transaction(async (transaction) => {
      const service = await transaction.service.update({
        where: { id: serviceId },
        data: serviceData,
      });

      if (price !== undefined) {
        const pricing = existing.pricings[0];
        if (pricing) {
          await transaction.pricing.update({
            where: { id: pricing.id },
            data: { amount: price, currency: currency ?? pricing.currency },
          });
        } else {
          await transaction.pricing.create({
            data: {
              amount: price,
              currency: currency ?? 'XAF',
              service: { connect: { id: serviceId } },
              university: { connect: { id: existing.universityId } },
            },
          });
        }
      }

      return transaction.service.findUniqueOrThrow({
        where: { id: service.id },
        include: { documentType: true, pricings: true },
      });
    });
  }

  async deleteService(serviceId: string) {
    const exists = await this.prisma.service.findUnique({ where: { id: serviceId }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException('Service introuvable');
    }

    return this.prisma.service.delete({ where: { id: serviceId } });
  }

  async getServicesByCategory(category: string) {
    return this.prisma.service.findMany({
      where: { documentType: { code: category } },
      include: { documentType: true, pricings: true },
      orderBy: { name: 'asc' },
    });
  }

  async getUniversityServiceStats(universityId: string) {
    const [totalServices, pricedServices, freeServices] = await Promise.all([
      this.prisma.service.count({ where: { universityId } }),
      this.prisma.service.count({ where: { universityId, pricings: { some: { isFree: false } } } }),
      this.prisma.service.count({ where: { universityId, pricings: { some: { isFree: true } } } }),
    ]);

    return { totalServices, pricedServices, freeServices };
  }
}
