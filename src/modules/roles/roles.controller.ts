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
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Créer un nouveau rôle (SUPER_ADMIN uniquement)' })
    @ApiResponse({ status: 201, description: 'Rôle créé avec succès.' })
    @ApiResponse({ status: 409, description: 'Le rôle existe déjà.' })
    create(@Body() dto: CreateRoleDto) {
        return this.rolesService.create(dto);
    }

    @Get()
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Lister tous les rôles du système' })
    @ApiResponse({ status: 200, description: 'Liste des rôles récupérée.' })
    findAll() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Obtenir les détails d\'un rôle par son ID' })
    @ApiResponse({ status: 200, description: 'Rôle trouvé.' })
    @ApiResponse({ status: 404, description: 'Rôle introuvable.' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.rolesService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Mettre à jour un rôle (SUPER_ADMIN uniquement)' })
    @ApiResponse({ status: 200, description: 'Rôle mis à jour.' })
    @ApiResponse({ status: 404, description: 'Rôle introuvable.' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateRoleDto,
    ) {
        return this.rolesService.update(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Supprimer un rôle (SUPER_ADMIN uniquement)' })
    @ApiResponse({ status: 200, description: 'Rôle supprimé.' })
    @ApiResponse({ status: 404, description: 'Rôle introuvable.' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.rolesService.remove(id);
    }
}