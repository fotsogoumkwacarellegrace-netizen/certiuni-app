import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { UniversitiesService } from './universities.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Universities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('universities')
export class UniversitiesController {
    constructor(private readonly universitiesService: UniversitiesService) { }

    @Post()
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Créer une nouvelle université (SUPER_ADMIN uniquement)' })
    create(@Body() dto: CreateUniversityDto) {
        return this.universitiesService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Lister toutes les universités' })
    findAll() {
        return this.universitiesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir une université par son ID' })
    findOne(@Param('id') id: string) {
        return this.universitiesService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Mettre à jour une université (SUPER_ADMIN uniquement)' })
    update(@Param('id') id: string, @Body() dto: UpdateUniversityDto) {
        return this.universitiesService.update(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Supprimer une université (SUPER_ADMIN uniquement)' })
    remove(@Param('id') id: string) {
        return this.universitiesService.remove(id);
    }
}