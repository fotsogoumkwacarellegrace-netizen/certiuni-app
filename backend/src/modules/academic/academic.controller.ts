import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AcademicService } from './academic.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { CreateLevelDto } from './dto/create-level.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Academic Structure')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academic')
export class AcademicController {
    constructor(private readonly academicService: AcademicService) { }

    // --- ANNEES ACADEMIQUES ---
    @Post('years')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Créer une année académique' })
    @ApiQuery({ name: 'universityId', required: false, description: 'Obligatoire si Super Admin' })
    async createYear(
        @Body() dto: CreateAcademicYearDto,
        @CurrentUser() user: any,
        @Query('universityId') universityId?: string,
    ) {
        return this.academicService.createYear(dto, user, universityId);
    }

    @Get('years')
    @ApiOperation({ summary: 'Lister les années académiques' })
    async findAllYears(@CurrentUser() user: any) {
        return this.academicService.findAllYears(user);
    }

    // --- PROGRAMMES ---
    @Post('programs')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Créer une filière / programme' })
    @ApiQuery({ name: 'universityId', required: false })
    async createProgram(
        @Body() dto: CreateProgramDto,
        @CurrentUser() user: any,
        @Query('universityId') universityId?: string,
    ) {
        return this.academicService.createProgram(dto, user, universityId);
    }

    @Get('programs')
    @ApiOperation({ summary: 'Lister les programmes / filières' })
    async findAllPrograms(@CurrentUser() user: any) {
        return this.academicService.findAllPrograms(user);
    }

    // --- NIVEAUX ---
    @Post('levels')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Créer un niveau d\'étude (Licence, Master, etc.)' })
    @ApiQuery({ name: 'universityId', required: false })
    async createLevel(
        @Body() dto: CreateLevelDto,
        @CurrentUser() user: any,
        @Query('universityId') universityId?: string,
    ) {
        return this.academicService.createLevel(dto, user, universityId);
    }

    @Get('levels')
    @ApiOperation({ summary: 'Lister les niveaux d\'études' })
    async findAllLevels(@CurrentUser() user: any) {
        return this.academicService.findAllLevels(user);
    }
}