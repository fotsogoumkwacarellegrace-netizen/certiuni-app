import { Controller, Get, Post, Body, UseGuards, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { DocumentGovernanceService } from './document-governance.service';

@Controller('admin/documents')
export class DocumentGovernanceController {
  constructor(private readonly docService: DocumentGovernanceService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('statistics')
  async getGlobalDocumentStatistics(@Query() filters: any) {
    return this.docService.getGlobalDocumentStatistics(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('models')
  async getDocumentModels(@Query() filters: any) {
    return this.docService.getDocumentModels(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('services')
  async getServiceCatalogue(@Query() filters: any) {
    return this.docService.getServiceCatalogue(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('reported-issues')
  async getReportedIssues(@Query() filters: any) {
    return this.docService.getReportedIssues(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('traceability')
  async getTraceabilityReport(@Query() filters: any) {
    return this.docService.getTraceabilityReport(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('link-management')
  async getLinkManagementReport(@Query() filters: any) {
    return this.docService.getLinkManagementReport(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('revoke-link')
  @HttpCode(HttpStatus.OK)
  async revokeSecureLink(@Body() body: { linkId: string; reason: string }, @GetUser('id') adminId: string) {
    return this.docService.revokeSecureLink(body.linkId, adminId, body.reason);
  }
}