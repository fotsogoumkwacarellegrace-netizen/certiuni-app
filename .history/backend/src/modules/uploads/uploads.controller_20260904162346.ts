import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    UseGuards,
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
import { UploadsService } from './uploads.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { multerOptions } from './interceptors/multer-config.interceptor';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    @Post('file')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Téléverser un fichier de façon sécurisée (PDF, Image, Excel, CSV)' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Fichier à téléverser (max 10 Mo)',
                },
                category: { type: 'string', example: 'DOCUMENT' },
                description: { type: 'string', example: 'Copie certifiée de la licence' },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Fichier téléversé et stocké avec succès.' })
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: UploadFileDto,
    ) {
        return this.uploadsService.processAndUpload(file, dto, 'documents');
    }
}