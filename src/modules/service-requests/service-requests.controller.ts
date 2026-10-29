import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    ParseUUIDPipe,
    Query,
    Req,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiQuery,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ServiceRequestsService } from './service-requests.services';
import { CreateRequestDto } from './dto/create-request.dto';
import {
    ServiceRequestStatus,
    UpdateRequestStatusDto,
} from './dto/update-request-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Service Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('service-requests')
export class ServiceRequestsController {
    constructor(
        private readonly serviceRequestsService: ServiceRequestsService,
    ) { }

    @Post()
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Soumettre une demande de service (Étudiant)' })
    @ApiResponse({ status: 201, description: 'Demande créée avec succès.' })
    create(@Req() req: any, @Body() dto: CreateRequestDto) {
        return this.serviceRequestsService.create(req.user.id, dto);
    }

    @Get('my-requests')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Lister les demandes de l étudiant connecté' })
    findMyRequests(@Req() req: any) {
        return this.serviceRequestsService.findAllForStudent(req.user.id);
    }

    @Get()
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Lister toutes les demandes de service (Admin)' })
    @ApiQuery({
        name: 'status',
        enum: ServiceRequestStatus,
        required: false,
        description: 'Filtrer par statut',
    })
    findAll(@Query('status') status?: ServiceRequestStatus) {
        return this.serviceRequestsService.findAll(status);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir les détails d une demande de service' })
    findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
        return this.serviceRequestsService.findOne(id, req.user);
    }

    @Patch(':id/status')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Changer le statut d une demande de service (Admin)' })
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateRequestStatusDto,
    ) {
        return this.serviceRequestsService.updateStatus(id, dto);
    }

    @Patch(':id/cancel')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Annuler une demande en attente (Étudiant)' })
    cancel(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
        return this.serviceRequestsService.cancelByStudent(id, req.user.id);
    }
}