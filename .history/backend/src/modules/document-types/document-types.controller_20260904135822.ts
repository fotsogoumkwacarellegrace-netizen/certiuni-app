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
import { DocumentTypesService } from './document-types.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Document Types')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('document-types')
export class DocumentTypesController {
    constructor(private readonly documentTypesService: DocumentTypesService) { }

    @Post()
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Créer un nouveau type de document' })
    @ApiResponse({ status: 201, description: 'Type de document créé avec succès.' })
    @ApiResponse({ status: 409, description: 'Le code existe déjà.' })
    create(@Body() dto: CreateDocumentTypeDto) {
        return this.documentTypesService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Lister tous les types de documents' })
    findAll() {
        return this.documentTypesService.findAll();
    }

    @Get('code/:code')
    @ApiOperation({ summary: 'Obtenir un type de document par son code' })
    findByCode(@Param('code') code: string) {
        return this.documentTypesService.findByCode(code);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir un type de document par son ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.documentTypesService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Mettre à jour un type de document' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateDocumentTypeDto,
    ) {
        return this.documentTypesService.update(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Supprimer un type de document' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.documentTypesService.remove(id);
    }
}