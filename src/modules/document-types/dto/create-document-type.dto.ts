import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';

export class CreateDocumentTypeDto {
    @ApiProperty({
        example: 'DIPLOMA_BACHELOR',
        description: 'Code unique du type de document (ex: DIPLOMA_BACHELOR, TRANSCRIPT_M2)',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le code est obligatoire.' })
    @Matches(/^[A-Z0-9_]+$/, {
        message: 'Le code doit être en majuscules avec des underscores (ex: DIPLOMA_BACHELOR).',
    })
    code: string;

    @ApiProperty({
        example: 'Diplôme de Licence',
        description: 'Nom officiel du type de document',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le nom du type de document est obligatoire.' })
    name: string;

    @ApiPropertyOptional({
        example: 'Document officiel certifiant l\'obtention du grade de Licence.',
        description: 'Description détaillée du type de document',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Indique si ce type de document nécessite un QR Code de vérification',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    requiresQrCode?: boolean;
}