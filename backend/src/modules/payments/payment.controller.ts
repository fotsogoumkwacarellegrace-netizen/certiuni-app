import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @Post('session')
  async createPaymentSession(
    @Body() data: {
      amount: number;
      currency?: string;
      customerEmail: string;
      successUrl: string;
      cancelUrl: string;
      metadata?: Record<string, string>;
    },
  ) {
    return this.service.createPaymentSession(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @Get('session/:sessionId')
  async retrievePaymentSession(
    @Param('sessionId') sessionId: string,
  ): ReturnType<PaymentService['retrievePaymentSession']> {
    return this.service.retrievePaymentSession(sessionId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @Post('refund/:paymentIntentId')
  async createRefund(
    @Param('paymentIntentId') paymentIntentId: string,
    @Body() data?: { reason?: string },
  ): ReturnType<PaymentService['createRefund']> {
    return this.service.createRefund(paymentIntentId, data?.reason);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @Get('intent/:intentId')
  async retrievePaymentIntent(
    @Param('intentId') intentId: string,
  ): ReturnType<PaymentService['retrievePaymentIntent']> {
    return this.service.retrievePaymentIntent(intentId);
  }
}