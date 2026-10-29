import {
    Controller,
    BadRequestException,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    ParseUUIDPipe,
    Req,
    HttpCode,
    HttpStatus,
    RawBodyRequest,
} from '@nestjs/common';
import { Request } from 'express';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('initiate')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Initier le paiement d un service (Étudiant)' })
    @ApiResponse({ status: 201, description: 'Paiement initialisé avec succès.' })
    initiate(@Req() req: any, @Body() dto: InitiatePaymentDto) {
        return this.paymentsService.initiatePayment(req.user.id, dto);
    }

    @Public()
    @Post('webhook/stripe')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Recevoir et vérifier les webhooks Stripe' })
    stripeWebhook(@Req() req: RawBodyRequest<Request>) {
        const signature = req.headers['stripe-signature'];
        if (typeof signature !== 'string' || !req.rawBody) {
            throw new BadRequestException('Signature Stripe ou corps brut manquant.');
        }
        return this.paymentsService.handleStripeWebhook(req.rawBody, signature);
    }

    @Get()
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Lister toutes les transactions de paiement (Admin)' })
    findAll() {
        return this.paymentsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir le détail d un paiement' })
    findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
        return this.paymentsService.findOne(id, req.user);
    }
}