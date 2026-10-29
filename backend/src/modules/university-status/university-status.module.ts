import { Module } from '@nestjs/common';
import { UniversityStatusService } from './university-status.service';
import { UniversityStatusController } from './university-status.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UniversityStatusController],
  providers: [UniversityStatusService, PrismaService],
  exports: [UniversityStatusService],
})
export class UniversityStatusModule {}