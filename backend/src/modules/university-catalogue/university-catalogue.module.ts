import { Module } from '@nestjs/common';
import { UniversityCatalogueService } from './university-catalogue.service';
import { UniversityCatalogueController } from './university-catalogue.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UniversityCatalogueController],
  providers: [UniversityCatalogueService, PrismaService],
  exports: [UniversityCatalogueService],
})
export class UniversityCatalogueModule {}