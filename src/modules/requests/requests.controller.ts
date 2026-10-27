import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Verification Requests')
@Controller('requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) { }

    // --- ROUTE PUBLIQUE : Soumission d'une demande par un tier ---
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Soumettre une demande de vérification (Accès public)' })
    @ApiResponse({ status: 201, description: 'Demande enregistrée avec un code de suivi généré.' })
    async create(@Body() dto: CreateRequestDto) {
        return this.requestsService.create(dto);
    }

    // --- ROUTE PUBLIQUE : Suivi du statut par le code reçu ---
    @Get('status')
    @ApiOperation({ summary: 'Consulter le statut d\'une demande via son code de suivi (Accès public)' })
    @ApiQuery({ name: 'code', required: true, example: 'REQ-A1B2C3D4' })
    async getStatus(@Query('code') trackingCode: string) {
        return this.requestsService.getStatusByTrackingCode(trackingCode);
    }

    // --- ROUTE PROTEGEE : Lister toutes les demandes pour les Admins ---
    @Get()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Lister les demandes de vérification (Admin/SuperAdmin)' })
    async findAll(@GetUser() user: any) {
        return this.requestsService.findAll(user);
    }

    // --- ROUTE PROTEGEE : Détail d'une demande ---
    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Consulter les détails d\'une demande par ID' })
    async findOne(@Param('id') id: string, @GetUser() user: any) {
        return this.requestsService.findOne(id, user);
    }

    // --- ROUTE PROTEGEE : Traiter/Changer le statut d'une demande ---
    @Put(':id/status')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Valider ou rejeter une demande de vérification' })
    async updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateRequestStatusDto,
        @GetUser() user: any,
    ) {
        return this.requestsService.updateStatus(id, dto, user);
    }
}