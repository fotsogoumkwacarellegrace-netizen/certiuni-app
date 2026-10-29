import { Controller, Get, Post, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ReportingService } from './reporting.service';

@Controller('admin/reports')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateGlobalReport(@Body() body: any) {
    return this.reportingService.generateGlobalReport(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('export')
  @HttpCode(HttpStatus.OK)
  async exportData(
    @Body() body: {
      exportType: 'users' | 'institutions' | 'universities' | 'requests' | 'documents' | 'payments';
      filters: any;
    },
    @GetUser('id') userId: string,
  ) {
    return this.reportingService.exportData(body.exportType, body.filters, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('sensitive-actions')
  async getSensitiveActionsTimeline(@Query() filters: any) {
    return this.reportingService.getSensitiveActionsTimeline(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('critical-changes')
  async getCriticalChangesTimeline(@Query() filters: any) {
    return this.reportingService.getCriticalChangesTimeline(filters);
  }
}