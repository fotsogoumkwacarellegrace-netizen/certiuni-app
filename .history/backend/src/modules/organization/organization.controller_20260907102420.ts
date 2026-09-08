import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiQuery,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('organizations')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) { }

    @Post()
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Créer une nouvelle organisation / unité académique' })
    @ApiResponse({ status: 201, description: 'Organisation créée avec succès.' })
    create(@Body() dto: CreateOrganizationDto) {
        return this.organizationService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Lister les organisations (Option de filtrage par institution)' })
    @ApiQuery({ name: 'institutionId', required: false, type: String })
    findAll(@Query('institutionId') institutionId?: string) {
        return this.organizationService.findAll(institutionId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir le détail d une organisation par son ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.organizationService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Mettre à jour une organisation' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateOrganizationDto,
    ) {
        return this.organizationService.update(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Supprimer une organisation' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.organizationService.remove(id);
    }
}