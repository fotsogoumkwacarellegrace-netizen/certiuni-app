import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecruiterService {
  private readonly logger = new Logger(RecruiterService.name);

  constructor(private prisma: PrismaService) {}

  async getAvailableServices(recruiterId: string) {
    return this.prisma.service.findMany({
      include: {
        documentType: true,
        pricings: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async getPriceBeforeConfirmation(serviceId: string, recruiterId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: { pricings: true },
    });
    if (!service) throw new Error('Service introuvable');

    const basePrice = service.pricings[0]?.amount ? Number(service.pricings[0].amount) : 0;
    return {
      service: service.name,
      description: service.description,
      basePrice,
      additionalFees: 0,
      totalPrice: basePrice,
      currency: service.pricings[0]?.currency || 'XAF',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }
}