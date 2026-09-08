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
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Programs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @ApiOperation({ summary: 'Créer une nouvelle filière (SUPER_ADMIN ou UNIV_ADMIN)' })
  @ApiResponse({ status: 201, description: 'Filière créée avec succès.' })
  @ApiResponse({ status: 404, description: 'Université introuvable.' })
  @ApiResponse({ status: 409, description: 'Le code existe déjà dans l\'établissement.' })
  create(@Body() dto: CreateProgramDto) {
    return this.programsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les filières du système' })
  @ApiResponse({ status: 200, description: 'Liste des filières récupérée.' })
  findAll() {
    return this.programsService.findAll();
  }

  @Get('university/:universityId')
  @ApiOperation({ summary: 'Lister toutes les filières d\'une université' })
  @ApiResponse({ status: 200, description: 'Liste des filières de l\'université.' })
  @ApiResponse({ status: 404, description: 'Université introuvable.' })
  findByUniversity(@Param('universityId', ParseUUIDPipe) universityId: string) {
    return this.programsService.findByUniversity(universityId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir les détails d\'une filière par son ID' })
  @ApiResponse({ status: 200, description: 'Filière trouvée.' })
  @ApiResponse({ status: 404, description: 'Filière introuvable.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.programsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @ApiOperation({ summary: 'Mettre à jour les informations d\'une filière' })
  @ApiResponse({ status: 200, description: 'Filière mise à jour.' })
  @ApiResponse({ status: 404, description: 'Filière introuvable.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProgramDto,
  ) {
    return this.programsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @ApiOperation({ summary: 'Supprimer une filière' })
  @ApiResponse({ status: 200, description: 'Filière supprimée.' })
  @ApiResponse({ status: 404, description: 'Filière introuvable.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.programsService.remove(id);
  }
}