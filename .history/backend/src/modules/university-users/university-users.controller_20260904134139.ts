import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
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
import { UniversityUsersService } from './university-users.service';
import { AttachUserDto } from './dto/attach-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('University Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('university-users')
export class UniversityUsersController {
  constructor(private readonly universityUsersService: UniversityUsersService) {}

  @Post('attach')
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @ApiOperation({ summary: 'Rattacher un utilisateur à une université' })
  @ApiResponse({ status: 201, description: 'Utilisateur rattaché avec succès.' })
  @ApiResponse({ status: 404, description: 'Utilisateur ou université introuvable.' })
  @ApiResponse({ status: 409, description: 'Déjà rattaché à cet établissement.' })
  attachUser(@Body() dto: AttachUserDto) {
    return this.universityUsersService.attachUser(dto);
  }

  @Get('university/:universityId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @ApiOperation({ summary: 'Lister tous les utilisateurs rattachés à une université' })
  @ApiResponse({ status: 200, description: 'Liste des membres récupérée.' })
  @ApiResponse({ status: 404, description: 'Université introuvable.' })
  findByUniversity(@Param('universityId', ParseUUIDPipe) universityId: string) {
    return this.universityUsersService.findByUniversity(universityId);
  }

  @Patch('university/:universityId/user/:userId/role')
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @ApiOperation({ summary: 'Mettre à jour le rôle d\'un utilisateur au sein d\'une université' })
  @ApiResponse({ status: 200, description: 'Rôle de l\'utilisateur mis à jour.' })
  @ApiResponse({ status: 400, description: 'L\'utilisateur n\'appartient pas à cette université.' })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable.' })
  updateUserRole(
    @Param('universityId', ParseUUIDPipe) universityId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.universityUsersService.updateUserRole(userId, universityId, dto);
  }

  @Delete('university/:universityId/user/:userId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
  @ApiOperation({ summary: 'Détacher un utilisateur d\'une université' })
  @ApiResponse({ status: 200, description: 'Utilisateur détaché avec succès.' })
  @ApiResponse({ status: 400, description: 'L\'utilisateur n\'appartient pas à cette université.' })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable.' })
  detachUser(
    @Param('universityId', ParseUUIDPipe) universityId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.universityUsersService.detachUser(userId, universityId);
  }
}