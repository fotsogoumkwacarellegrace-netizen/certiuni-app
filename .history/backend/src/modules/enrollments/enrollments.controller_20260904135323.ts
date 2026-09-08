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
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentStatusDto } from './dto/update-enrollment-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enrollments')
export class EnrollmentsController {
    constructor(private readonly enrollmentsService: EnrollmentsService) { }

    @Post()
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Inscrire un étudiant dans un cursus académique' })
    @ApiResponse({ status: 201, description: 'Inscription créée avec succès.' })
    @ApiResponse({ status: 404, description: 'Étudiant, filière ou année académique introuvable.' })
    @ApiResponse({ status: 409, description: 'L\'étudiant est déjà inscrit pour cette année.' })
    create(@Body() dto: CreateEnrollmentDto) {
        return this.enrollmentsService.create(dto);
    }

    @Get()
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Lister toutes les inscriptions du système' })
    findAll() {
        return this.enrollmentsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir les détails d\'une inscription par son ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.enrollmentsService.findOne(id);
    }

    @Get('student/:studentId')
    @ApiOperation({ summary: 'Obtenir l\'historique d\'inscription d\'un étudiant' })
    findByStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
        return this.enrollmentsService.findByStudent(studentId);
    }

    @Get('program/:programId/year/:academicYearId')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Lister les étudiants inscrits dans une filière pour une année donnée' })
    findByProgramAndYear(
        @Param('programId', ParseUUIDPipe) programId: string,
        @Param('academicYearId', ParseUUIDPipe) academicYearId: string,
    ) {
        return this.enrollmentsService.findByProgramAndYear(programId, academicYearId);
    }

    @Patch(':id/status')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Mettre à jour le statut d\'une inscription' })
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateEnrollmentStatusDto,
    ) {
        return this.enrollmentsService.updateStatus(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Supprimer une inscription académique' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.enrollmentsService.remove(id);
    }
}