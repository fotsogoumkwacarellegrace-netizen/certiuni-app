import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    ParseUUIDPipe,
    Req,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { PaymentStatusDto } from './dto/payment-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

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

    @Patch(':id/status')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Mettre à jour le statut d un paiement (Admin / Callback manuel)' })
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: PaymentStatusDto,
    ) {
        return this.paymentsService.processPaymentStatus(id, dto);
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