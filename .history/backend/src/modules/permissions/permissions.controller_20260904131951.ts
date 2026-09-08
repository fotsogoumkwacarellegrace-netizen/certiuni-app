import {
  Controller,
  Get,
  Post,
  Body,
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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Créer une nouvelle permission (SUPER_ADMIN uniquement)' })
  @ApiResponse({ status: 201, description: 'Permission créée avec succès.' })
  @ApiResponse({ status: 409, description: 'La permission existe déjà.' })
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Post('assign')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Assigner un ensemble de permissions à un rôle (SUPER_ADMIN)' })
  @ApiResponse({ status: 200, description: 'Permissions assignées avec succès au rôle.' })
  @ApiResponse({ status: 404, description: 'Rôle introuvable.' })
  assignPermissions(@Body() dto: AssignPermissionsDto) {
    return this.permissionsService.assignPermissionsToRole(dto);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @ApiOperation({ summary: 'Lister toutes les permissions du système' })
  @ApiResponse({ status: 200, description: 'Liste des permissions récupérée.' })
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @ApiOperation({ summary: 'Obtenir les détails d\'une permission' })
  @ApiResponse({ status: 200, description: 'Permission trouvée.' })
  @ApiResponse({ status: 404, description: 'Permission introuvable.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionsService.findOne(id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Supprimer une permission (SUPER_ADMIN uniquement)' })
  @ApiResponse({ status: 200, description: 'Permission supprimée.' })
  @ApiResponse({ status: 404, description: 'Permission introuvable.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionsService.remove(id);
  }
}