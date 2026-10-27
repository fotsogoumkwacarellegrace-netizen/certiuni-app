import { Controller, Get, Post, Body, Param, UseGuards, Query, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { InstitutionService } from './institution.service';

@Controller('admin/institutions')
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  async getAllUsers(@Query() filters: any) {
    return this.institutionService.getAllUsers(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':userId/status')
  @HttpCode(HttpStatus.OK)
  async toggleAccountStatus(
    @Param('userId') userId: string,
    @Body() body: { status: 'ACTIVE' | 'SUSPENDED' | 'REJECTED'; reason: string },
    @GetUser('id') adminId: string,
  ) {
    return this.institutionService.toggleAccountStatus(
      userId,
      body.status,
      adminId,
      body.reason,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('registration/:registrationId/review')
  @HttpCode(HttpStatus.OK)
  async reviewInstitutionRegistration(
    @Param('registrationId') registrationId: string,
    @Body() body: { action: 'APPROVE' | 'REFUSE' | 'SUSPEND'; justification: string },
    @GetUser('id') adminId: string,
  ) {
    return this.institutionService.reviewInstitutionRegistration(
      registrationId,
      adminId,
      body.action,
      body.justification,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('roles/manage')
  @HttpCode(HttpStatus.OK)
  async manageGlobalRoles(
    @Body() body: {
      action: 'GRANT' | 'REVOKE';
      targetType: 'USER' | 'INSTITUTION';
      targetId: string;
      role: UserRole;
      permissions: string[];
    },
    @GetUser('id') adminId: string,
  ) {
    return this.institutionService.manageGlobalRoles(
      adminId,
      body.action,
      body.targetType,
      body.targetId,
      body.role,
      body.permissions,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('security/events')
  async getSecurityEvents(@Query() filters: any) {
    return this.institutionService.getSecurityEvents(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('security/configure')
  @HttpCode(HttpStatus.OK)
  async configureSecuritySettings(
    @Body() body: any,
    @GetUser('id') adminId: string,
  ) {
    return this.institutionService.configureSecuritySettings(body, adminId);
  }
}