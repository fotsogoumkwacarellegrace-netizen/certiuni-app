import { Module } from '@nestjs/common';
import { StudentDashboardService } from './student-dashboard.service';
import { StudentDashboardController } from './student-dashboard.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StudentDashboardController],
  providers: [StudentDashboardService, PrismaService],
  exports: [StudentDashboardService],
})
export class StudentDashboardModule {}