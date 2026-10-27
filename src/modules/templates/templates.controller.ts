import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau modèle de diplôme (Super Admin ou Admin Univ)' })
  @ApiResponse({ status: 201, description: 'Le modèle de diplôme a été créé avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès refusé ou ID université manquant.' })
  async create(
    @Body() dto: CreateTemplateDto,
    @CurrentUser() user: any,
  ) {
    return this.templatesService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les modèles de diplômes accessibles par l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Liste des modèles récupérée.' })
  async findAll(@CurrentUser() user: any) {
    return this.templatesService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un modèle de diplôme par son ID' })
  @ApiResponse({ status: 200, description: 'Modèle trouvé.' })
  @ApiResponse({ status: 404, description: 'Modèle introuvable.' })
  @ApiResponse({ status: 403, description: 'Accès non autorisé à ce modèle.' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.templatesService.findOne(id, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un modèle de diplôme existant' })
  @ApiResponse({ status: 200, description: 'Modèle mis à jour avec succès.' })
  @ApiResponse({ status: 400, description: 'Syntaxe Handlebars invalide.' })
  @ApiResponse({ status: 403, description: 'Accès non autorisé.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateDto,
    @CurrentUser() user: any,
  ) {
    return this.templatesService.update(id, dto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un modèle de diplôme' })
  @ApiResponse({ status: 204, description: 'Modèle supprimé avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès non autorisé.' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.templatesService.remove(id, user);
  }
}