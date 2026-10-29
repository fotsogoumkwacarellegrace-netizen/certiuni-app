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
import { UniversitiesService } from './universities.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Universities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('universities')
export class UniversitiesController {
    constructor(private readonly universitiesService: UniversitiesService) { }

    @Post()
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Créer une nouvelle université (SUPER_ADMIN uniquement)' })
    @ApiResponse({ status: 201, description: 'Université créée avec succès.' })
    @ApiResponse({ status: 409, description: 'Une université avec ce code existe déjà.' })
    create(@Body() dto: CreateUniversityDto) {
        return this.universitiesService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Lister toutes les universités' })
    @ApiResponse({ status: 200, description: 'Liste des universités récupérée avec succès.' })
    findAll() {
        return this.universitiesService.findAll();
    }

    @Get('code/:code')
    @ApiOperation({ summary: 'Obtenir une université par son code (ex: UY1)' })
    @ApiResponse({ status: 200, description: 'Université trouvée.' })
    @ApiResponse({ status: 404, description: 'Université introuvable.' })
    findByCode(@Param('code') code: string) {
        return this.universitiesService.findByCode(code);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir une université par son ID' })
    @ApiResponse({ status: 200, description: 'Université trouvée.' })
    @ApiResponse({ status: 404, description: 'Université introuvable.' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.universitiesService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Mettre à jour une université (SUPER_ADMIN ou UNIV_ADMIN)' })
    @ApiResponse({ status: 200, description: 'Université mise à jour avec succès.' })
    @ApiResponse({ status: 404, description: 'Université introuvable.' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateUniversityDto,
    ) {
        return this.universitiesService.update(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Supprimer une université (SUPER_ADMIN uniquement)' })
    @ApiResponse({ status: 200, description: 'Université supprimée avec succès.' })
    @ApiResponse({ status: 404, description: 'Université introuvable.' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.universitiesService.remove(id);
    }
}