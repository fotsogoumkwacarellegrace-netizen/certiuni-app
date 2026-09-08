import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@ApiTags('templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN, UserRole.ISSUER)
  @ApiOperation({ summary: 'Créer un nouveau modèle de diplôme' })
  async create(@Body() dto: CreateTemplateDto, @Request() req: any) {
    return this.templatesService.create(dto, req.user);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN, UserRole.ISSUER)
  @ApiOperation({ summary: 'Lister tous les modèles accessibles à l utilisateur' })
  async findAll(@Request() req: any) {
    return this.templatesService.findAll(req.user);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN, UserRole.ISSUER)
  @ApiOperation({ summary: 'Obtenir les détails d un modèle par son ID' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.templatesService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN, UserRole.ISSUER)
  @ApiOperation({ summary: 'Mettre à jour la configuration d un modèle' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateDto,
    @Request() req: any,
  ) {
    return this.templatesService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @ApiOperation({ summary: 'Supprimer un modèle de diplôme' })
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.templatesService.remove(id, req.user);
  }
}