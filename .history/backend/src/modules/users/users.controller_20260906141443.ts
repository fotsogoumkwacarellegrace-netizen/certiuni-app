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
    Query,
    ForbiddenException,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiQuery,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Créer un nouvel utilisateur (SUPER_ADMIN / UNIV_ADMIN)' })
    @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès.' })
    @ApiResponse({ status: 400, description: 'Données invalides ou email déjà utilisé.' })
    @ApiResponse({ status: 403, description: 'Permissions insuffisantes.' })
    create(
        @GetUser() currentUser: any,
        @Body() dto: CreateUserDto,
    ) {
        // Un UNIV_ADMIN ne peut créer un utilisateur que dans sa propre université
        if (currentUser.role === UserRole.UNIV_ADMIN && dto.universityId !== currentUser.universityId) {
            throw new ForbiddenException('Vous ne pouvez créer des utilisateurs que pour votre propre université.');
        }
        return this.usersService.create(dto);
    }

    @Get()
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Lister les utilisateurs (SUPER_ADMIN : tous / UNIV_ADMIN : son établissement)' })
    @ApiQuery({ name: 'universityId', required: false, type: String })
    @ApiResponse({ status: 200, description: 'Liste des utilisateurs récupérée.' })
    findAll(
        @GetUser() currentUser: any,
        @Query('universityId') universityId?: string,
    ) {
        // Restriction multi-tenant automatique pour UNIV_ADMIN
        const targetUniversityId =
            currentUser.role === UserRole.UNIV_ADMIN
                ? currentUser.universityId
                : universityId;

        return this.usersService.findAll(targetUniversityId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir un utilisateur par son ID' })
    @ApiResponse({ status: 200, description: 'Utilisateur trouvé.' })
    @ApiResponse({ status: 404, description: 'Utilisateur introuvable.' })
    async findOne(
        @GetUser() currentUser: any,
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        const user = await this.usersService.findOne(id);

        // Vérification de cloisonnement pour UNIV_ADMIN
        if (currentUser.role === UserRole.UNIV_ADMIN && user.universityId !== currentUser.universityId) {
            throw new ForbiddenException('Accès refusé à cet utilisateur.');
        }

        return user;
    }

    @Patch(':id')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
    @ApiResponse({ status: 200, description: 'Utilisateur mis à jour.' })
    @ApiResponse({ status: 404, description: 'Utilisateur introuvable.' })
    async update(
        @GetUser() currentUser: any,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateUserDto,
    ) {
        if (currentUser.role === UserRole.UNIV_ADMIN) {
            const targetUser = await this.usersService.findOne(id);
            if (targetUser.universityId !== currentUser.universityId) {
                throw new ForbiddenException('Vous ne pouvez modifier que les utilisateurs de votre université.');
            }
        }

        return this.usersService.update(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Désactiver/Supprimer un utilisateur (SUPER_ADMIN uniquement)' })
    @ApiResponse({ status: 200, description: 'Utilisateur supprimé ou désactivé.' })
    @ApiResponse({ status: 404, description: 'Utilisateur introuvable.' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.remove(id);
    }
}