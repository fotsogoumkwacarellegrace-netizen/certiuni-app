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
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiQuery,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { TariffsService } from './tariffs.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Tariffs')
@Controller('tariffs')
export class TariffsController {
    constructor(private readonly tariffsService: TariffsService) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Créer un nouveau tarif (Super Admin)' })
    @ApiResponse({ status: 201, description: 'Tarif créé avec succès.' })
    create(@Body() dto: CreateTariffDto) {
        return this.tariffsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Lister les tarifs' })
    @ApiQuery({
        name: 'universityId',
        required: false,
        description: 'Filtrer les tarifs par université',
    })
    findAll(@Query('universityId') universityId?: string) {
        return this.tariffsService.findAll(universityId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir les détails d un tarif par son ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.tariffsService.findOne(id);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Mettre à jour un tarif (Super Admin)' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateTariffDto,
    ) {
        return this.tariffsService.update(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({ summary: 'Supprimer un tarif (Super Admin)' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.tariffsService.remove(id);
    }
}