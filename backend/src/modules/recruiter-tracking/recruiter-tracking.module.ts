import { Module } from '@nestjs/common';
import { RecruiterTrackingService } from './recruiter-tracking.service';
import { RecruiterTrackingController } from './recruiter-tracking.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RecruiterTrackingController],
  providers: [RecruiterTrackingService, PrismaService],
  exports: [RecruiterTrackingService],
})
export class RecruiterTrackingModule {}