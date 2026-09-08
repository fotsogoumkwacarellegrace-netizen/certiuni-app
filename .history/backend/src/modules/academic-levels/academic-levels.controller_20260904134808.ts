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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AcademicLevelsService } from './academic-levels.service';
import { CreateAcademicLevelDto } from './dto/create-academic-level.dto';
import { UpdateAcademicLevelDto } from './dto/update-academic-level.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Academic Levels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academic-levels')
export class AcademicLevelsController {
    constructor(private readonly academicLevelsService: AcademicLevelsService) { }

    @Post()
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Créer un niveau académique' })
    @ApiResponse({ status: 201, description: 'Niveau créé avec succès.' })
    @ApiResponse({ status: 409, description: 'Code de niveau déjà existant.' })
    create(@Body() dto: CreateAcademicLevelDto) {
        return this.academicLevelsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Lister tous les niveaux académiques' })
    findAll() {
        return this.academicLevelsService.findAll();
    }

    @Get('university/:universityId')
    @ApiOperation({ summary: 'Lister les niveaux d\'une université' })
    findByUniversity(@Param('universityId', ParseUUIDPipe) universityId: string) {
        return this.academicLevelsService.findByUniversity(universityId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir un niveau académique par son ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.academicLevelsService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Mettre à jour un niveau académique' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateAcademicLevelDto,
    ) {
        return this.academicLevelsService.update(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Supprimer un niveau académique' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.academicLevelsService.remove(id);
    }
}