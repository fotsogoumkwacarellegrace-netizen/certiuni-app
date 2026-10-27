import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SuperAdminDashboardService } from './super-admin-dashboard.service';

@Controller('super-admin-dashboard')
export class SuperAdminDashboardController {
  constructor(private readonly service: SuperAdminDashboardService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('global')
  async getGlobalSupervision() {
    return this.service.getGlobalSupervision();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('university/:universityId')
  async getUniversitySupervision(@Param('universityId') universityId: string) {
    return this.service.getUniversitySupervision(universityId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('pending-requests')
  async getAllPendingRequests() {
    return this.service.getAllPendingRequests();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('status-distribution')
  async getStatusDistribution() {
    return this.service.getStatusDistribution();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('recent-activity')
  async getRecentActivity(@Query('days') days: number = 30) {
    return this.service.getRecentActivity(days);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('role-distribution')
  async getRoleDistribution() {
    return this.service.getRoleDistribution();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('export/:type')
  async getExportableData(@Param('type') exportType: 'requests' | 'users' | 'universities') {
    return this.service.getExportableData(exportType);
  }
}