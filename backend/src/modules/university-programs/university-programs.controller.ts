import { Controller, Get, Post, Body, Param, UseGuards, Query, Patch, Delete } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UniversityProgramsService } from './university-programs.service';

@Controller('university-programs')
export class UniversityProgramsController {
  constructor(private readonly service: UniversityProgramsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Get()
  getAllPrograms(@Query('universityId') universityId?: string) {
    return this.service.getAllPrograms(universityId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Get(':programId')
  getProgramById(@Param('programId') programId: string) {
    return this.service.getProgramById(programId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  createProgram(@Body() data: { universityId: string; name: string; code: string; description?: string }) {
    return this.service.createProgram(data.universityId, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @Patch(':programId')
  updateProgram(
    @Param('programId') programId: string,
    @Body() data: { name?: string; code?: string; description?: string },
  ) {
    return this.service.updateProgram(programId, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':programId')
  deleteProgram(@Param('programId') programId: string) {
    return this.service.deleteProgram(programId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Get(':programId/levels')
  getProgramLevels(@Param('programId') programId: string) {
    return this.service.getProgramLevels(programId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post(':programId/levels')
  createAcademicLevel(@Param('programId') programId: string, @Body() data: { name: string; level: number }) {
    return this.service.createAcademicLevel(programId, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.UNIV_ADMIN, UserRole.SUPER_ADMIN)
  @Get('university/:universityId/stats')
  getUniversityStats(@Param('universityId') universityId: string) {
    return this.service.getUniversityStats(universityId);
  }
}
