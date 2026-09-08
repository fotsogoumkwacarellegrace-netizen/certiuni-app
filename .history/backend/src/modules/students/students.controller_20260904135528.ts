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
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Post()
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Créer un profil étudiant pour un utilisateur' })
    @ApiResponse({ status: 201, description: 'Profil étudiant créé avec succès.' })
    @ApiResponse({ status: 404, description: 'Utilisateur introuvable.' })
    @ApiResponse({ status: 409, description: 'Matricule ou profil déjà existant.' })
    create(@Body() dto: CreateStudentDto) {
        return this.studentsService.create(dto);
    }

    @Get()
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Lister tous les profils étudiants' })
    findAll() {
        return this.studentsService.findAll();
    }

    @Get('matricule/:matricule')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Obtenir un étudiant par son matricule' })
    findByMatricule(@Param('matricule') matricule: string) {
        return this.studentsService.findByMatricule(matricule);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Obtenir le profil étudiant associé à un compte User' })
    findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
        return this.studentsService.findByUserId(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir un profil étudiant par son ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.studentsService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Mettre à jour un profil étudiant' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateStudentDto,
    ) {
        return this.studentsService.update(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Supprimer un profil étudiant' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.studentsService.remove(id);
    }
}