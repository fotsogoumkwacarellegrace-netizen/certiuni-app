import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Créer un nouvel utilisateur (SUPER_ADMIN / UNIVERSITY_ADMIN)' })
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @Get()
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Lister tous les utilisateurs (SUPER_ADMIN uniquement)' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir un utilisateur par son ID' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.update(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Supprimer un utilisateur (SUPER_ADMIN uniquement)' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}