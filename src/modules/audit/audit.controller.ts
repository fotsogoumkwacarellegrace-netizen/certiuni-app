import {
    Controller,
    Get,
    Param,
    Query,
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
import { AuditService } from './audit.service';
import { QueryAuditDto } from './dto/query-audit.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
@Controller('audit')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get()
    @ApiOperation({ summary: 'Consulter le journal d audit système (Super Admin / Admin Univ)' })
    @ApiResponse({ status: 200, description: 'Liste des logs d audit récupérée.' })
    findAll(@Query() query: QueryAuditDto) {
        return this.auditService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir le détail d une entrée de journal d audit' })
    @ApiResponse({ status: 200, description: 'Détail du log récupéré.' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.auditService.findOne(id);
    }
}