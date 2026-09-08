import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseUUIDPipe,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiQuery,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Services Catalog')
@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Créer un nouveau service au catalogue (Super Admin)' })
    @ApiResponse({ status: 201, description: 'Service créé avec succès.' })
    @ApiResponse({ status: 409, description: 'Code de service déjà existant.' })
    create(@Body() dto: CreateServiceDto) {
        return this.servicesService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Lister les services du catalogue (Accès Public)' })
    @ApiQuery({
        name: 'includeInactive',
        required: false,
        type: Boolean,
        description: 'Inclure les services inactifs (Réservé aux administrateurs)',
    })
    findAll(@Query('includeInactive') includeInactive?: string) {
        const isInclude = includeInactive === 'true';
        return this.servicesService.findAll(isInclude);
    }

    @Get('code/:code')
    @ApiOperation({ summary: 'Obtenir un service par son code' })
    findByCode(@Param('code') code: string) {
        return this.servicesService.findByCode(code);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir les détails d un service par son ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.servicesService.findOne(id);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Mettre à jour un service du catalogue (Super Admin)' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateServiceDto,
    ) {
        return this.servicesService.update(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Supprimer un service du catalogue (Super Admin)' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.servicesService.remove(id);
    }
}