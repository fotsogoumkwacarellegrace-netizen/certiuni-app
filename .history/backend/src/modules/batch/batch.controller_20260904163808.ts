import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    UseGuards,
    Req,
    HttpCode,
    HttpStatus,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiConsumes,
    ApiBody,
    ApiResponse,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { BatchService } from './batch.service';
import { UploadBatchDto } from './dto/upload-batch.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Batch')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
@Controller('batch')
export class BatchController {
    constructor(private readonly batchService: BatchService) { }

    @Post('upload')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Importer un lot de données en masse via fichier Excel ou CSV' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Fichier Excel (.xlsx, .xls) ou CSV (.csv) à parser',
                },
                batchType: {
                    type: 'string',
                    enum: ['STUDENTS_IMPORT', 'DIPLOMAS_IMPORT', 'REQUESTS_IMPORT'],
                    example: 'STUDENTS_IMPORT',
                },
                institutionId: {
                    type: 'string',
                    example: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
                },
                description: {
                    type: 'string',
                    example: 'Importation des étudiants de la Faculté des Sciences 2025/2026',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Fichier analysé et lot d\'importation traité avec rapport détaillé.' })
    async uploadBatch(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: UploadBatchDto,
        @Req() req: any,
    ) {
        if (!file) {
            throw new BadRequestException('Veuillez fournir un fichier .csv ou .xlsx.');
        }
        return this.batchService.processBatchUpload(file, dto, req.user.id);
    }
}