import {
    Controller,
    Post,
    Delete,
    Get,
    Param,
    Body,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
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
import { FilesService } from './files.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post('upload')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Téléverser un fichier sur le stockage S3/MinIO' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                folder: {
                    type: 'string',
                    example: 'certificates',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Fichier téléversé avec succès.' })
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB Limit
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf|svg)$/ }),
                ],
            }),
        )
        file: Express.Multer.File,
        @Body() dto: UploadFileDto,
    ) {
        return this.filesService.uploadFile(file, dto.folder);
    }

    @Get('presigned-url/*')
    @ApiOperation({ summary: 'Obtenir une URL de téléchargement pré-signée temporaire' })
    getPresignedUrl(@Param('0') key: string) {
        return this.filesService.getPresignedDownloadUrl(key);
    }

    @Delete('/*')
    @Roles(UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN)
    @ApiOperation({ summary: 'Supprimer un fichier du stockage S3/MinIO' })
    deleteFile(@Param('0') key: string) {
        return this.filesService.deleteFile(key);
    }
}