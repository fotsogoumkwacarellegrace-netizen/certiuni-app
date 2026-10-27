import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    UseGuards,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AccessService } from './access.service';
import { CheckAccessDto } from './dto/check-access.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Access & Authorization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('access')
export class AccessController {
    constructor(private readonly accessService: AccessService) { }

    @Post('check')
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Évaluer dynamiquement les droits d\'accès d\'un utilisateur' })
    @ApiResponse({ status: 200, description: 'Évaluation de l\'accès exécutée avec succès.' })
    @ApiResponse({ status: 404, description: 'Utilisateur introuvable.' })
    checkAccess(@Body() dto: CheckAccessDto) {
        return this.accessService.checkAccess(dto);
    }

    @Get('user/:id/permissions')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Obtenir la liste effective des permissions accordées à un utilisateur' })
    @ApiResponse({ status: 200, description: 'Liste des permissions calculées.' })
    @ApiResponse({ status: 404, description: 'Utilisateur introuvable.' })
    getUserPermissions(@Param('id', ParseUUIDPipe) id: string) {
        return this.accessService.getUserEffectivePermissions(id);
    }
}