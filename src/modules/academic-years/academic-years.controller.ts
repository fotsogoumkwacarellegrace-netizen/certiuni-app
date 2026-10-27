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
import { AcademicYearsService } from './academic-years.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Academic Years')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academic-years')
export class AcademicYearsController {
    constructor(private readonly academicYearsService: AcademicYearsService) { }

    @Post()
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Créer une nouvelle année académique' })
    @ApiResponse({ status: 201, description: 'Année académique créée.' })
    @ApiResponse({ status: 409, description: 'L\'année existe déjà.' })
    create(@Body() dto: CreateAcademicYearDto) {
        return this.academicYearsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Lister toutes les années académiques' })
    findAll() {
        return this.academicYearsService.findAll();
    }

    @Get('current')
    @ApiOperation({ summary: 'Obtenir l\'année académique courante' })
    findCurrent() {
        return this.academicYearsService.findCurrent();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir une année académique par son ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.academicYearsService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Mettre à jour une année académique' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateAcademicYearDto,
    ) {
        return this.academicYearsService.update(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Supprimer une année académique (SUPER_ADMIN uniquement)' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.academicYearsService.remove(id);
    }
}