import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    UseGuards,
    ParseUUIDPipe,
    Req,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { DocumentsService } from './documents.service';
import { IssueDocumentDto } from './dto/issue-document.dto';
import { RevokeDocumentDto } from './dto/revoke-document.dto';
import { BatchIssueDocumentDto } from './dto/batch-issue-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post('issue')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Émettre un nouveau document certifié' })
    @ApiResponse({ status: 201, description: 'Document émis avec succès.' })
    @ApiResponse({ status: 404, description: 'Étudiant, Type ou Inscription introuvable.' })
    issue(@Body() dto: IssueDocumentDto, @Req() req: any) {
        return this.documentsService.issue(dto, req.user.id);
    }

    @Post('issue/batch')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Émettre une série de documents en lot' })
    @ApiResponse({ status: 201, description: 'Traitement du lot effectué.' })
    batchIssue(@Body() dto: BatchIssueDocumentDto, @Req() req: any) {
        return this.documentsService.batchIssue(dto, req.user.id);
    }

    @Get()
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Lister tous les documents émis' })
    findAll() {
        return this.documentsService.findAll();
    }

    @Get('number/:certificateNumber')
    @ApiOperation({ summary: 'Obtenir un document par son numéro officiel' })
    findByNumber(@Param('certificateNumber') certificateNumber: string) {
        return this.documentsService.findByNumber(certificateNumber);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir les détails d un document par son ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.documentsService.findOne(id);
    }

    @Patch(':id/revoke')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Révoquer un document certifié' })
    @ApiResponse({ status: 200, description: 'Document révoqué.' })
    @ApiResponse({ status: 409, description: 'Le document est déjà révoqué.' })
    revoke(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: RevokeDocumentDto,
    ) {
        return this.documentsService.revoke(id, dto);
    }
}