import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { TransverseEnginesService } from './transverse-engines.service';

@Controller('admin/transverse')
export class TransverseEnginesController {
  constructor(private readonly enginesService: TransverseEnginesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('process-request')
  async processRequest(
    @Body() body: { requestId: string; action: 'CREATE' | 'UPDATE' | 'DECIDE' | 'CLOSE'; data: any },
    @GetUser('id') userId: string,
  ) {
    return this.enginesService.processRequestEngine(body.requestId, body.action, body.data, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('document')
  async documentEngine(
    @Body() body: { documentId: string; action: 'CREATE' | 'UPDATE' | 'VERSION' | 'REVOKE'; data: any },
    @GetUser('id') userId: string,
  ) {
    return this.enginesService.documentEngine(body.documentId, body.action, body.data, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('link')
  async linkEngine(
    @Body() body: { linkId: string; action: 'VALIDATE' | 'REVOKE' | 'CHECK_ACCESS'; userId: string },
    @GetUser('id') adminId: string,
  ) {
    return this.enginesService.linkEngine(body.linkId, body.action, body.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('payment')
  async paymentEngine(
    @Body() body: { transactionId: string; action: 'INITIATE' | 'CONFIRM' | 'FAIL' | 'CANCEL' | 'REFUND'; data: any },
    @GetUser('id') userId: string,
  ) {
    return this.enginesService.paymentEngine(body.transactionId, body.action, body.data, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('receipt')
  async receiptEngine(@Body() body: { transactionId: string; userId: string }) {
    return this.enginesService.receiptEngine(body.transactionId, body.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('notification')
  async notificationEngine(
    @Body() body: { userId: string; template: string; data: any; channel: 'EMAIL' | 'SMS' | 'IN_APP' },
    @GetUser('id') adminId: string,
  ) {
    return this.enginesService.notificationEngine(body.userId, body.template, body.data, body.channel);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('batch')
  async batchEngine(
    @Body() body: { importId: string; action: 'VALIDATE' | 'PROGRESS' | 'RETRY' | 'FINALIZE'; data: any },
    @GetUser('id') userId: string,
  ) {
    return this.enginesService.batchEngine(body.importId, body.action, body.data, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('log')
  async logEngine(
    @Body() body: { action: string; targetType: string; targetId: string; userId: string; details: any; result: any },
    @GetUser('id') adminId: string,
  ) {
    return this.enginesService.logEngine(body.action, body.targetType, body.targetId, body.userId, body.details, body.result);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('consistency')
  async consistencyEngine(@Query() filters: any, @GetUser('id') userId: string) {
    return this.enginesService.consistencyEngine(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('timezone')
  async timezoneEngine(@Body() body: any, @GetUser('id') userId: string) {
    return this.enginesService.timezoneEngine(body);
  }
}