import { Controller, Get, Query, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SecurityConfigurationService } from './security-configuration.service';

@Controller('admin/security')
export class SecurityConfigurationController {
  constructor(private readonly securityService: SecurityConfigurationService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('services-status')
  async getServicesStatus() {
    return this.securityService.getServicesStatus();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('technical-alerts')
  async getTechnicalAlerts(@Query() filters: any) {
    return this.securityService.getTechnicalAlerts(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('payment-summary')
  async getPaymentSummary(@Query() filters: any) {
    return this.securityService.getPaymentSummary(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('payment-providers')
  async getPaymentProvidersStatus() {
    return this.securityService.getPaymentProvidersStatus();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('audit-logs')
  async getAuditLogs(@Query() filters: any) {
    return this.securityService.getAuditLogs(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('backup-status')
  async getBackupStatus() {
    return this.securityService.getBackupStatus();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('global-parameter')
  @HttpCode(HttpStatus.OK)
  async updateGlobalParameter(
    @Body() body: { key: string; value: any },
    @GetUser('id') adminId: string,
  ) {
    return this.securityService.updateGlobalParameter(body.key, body.value, adminId);
  }
}