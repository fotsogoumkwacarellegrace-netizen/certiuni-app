import { Module } from '@nestjs/common';
import { SuperAdminDashboardService } from './super-admin-dashboard.service';
import { SuperAdminDashboardController } from './super-admin-dashboard.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SuperAdminDashboardController],
  providers: [SuperAdminDashboardService, PrismaService],
  exports: [SuperAdminDashboardService],
})
export class SuperAdminDashboardModule {}