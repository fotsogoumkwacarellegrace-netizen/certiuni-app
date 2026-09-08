import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum FileCategory {
    DOCUMENT = 'DOCUMENT',
    IMAGE = 'IMAGE',
    SPREADSHEET = 'SPREADSHEET',
    AVATAR = 'AVATAR',
}

export class UploadFileDto {
    @ApiPropertyOptional({
        enum: FileCategory,
        example: FileCategory.DOCUMENT,
        description: 'Catégorie du fichier envoyé',
    })
    @IsOptional()
    @IsEnum(FileCategory, { message: 'Catégorie de fichier invalide.' })
    category?: FileCategory;

    @ApiPropertyOptional({
        example: 'Documents académiques pour certification',
        description: 'Description optionnelle associée au fichier',
    })
    @IsOptional()
    @IsString()
    description?: string;
}
