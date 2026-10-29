import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export enum BatchType {
    STUDENTS_IMPORT = 'STUDENTS_IMPORT',
    DIPLOMAS_IMPORT = 'DIPLOMAS_IMPORT',
    REQUESTS_IMPORT = 'REQUESTS_IMPORT',
}

export class UploadBatchDto {
    @ApiProperty({
        enum: BatchType,
        example: BatchType.STUDENTS_IMPORT,
        description: 'Type de données à importer en masse',
    })
    @IsEnum(BatchType, { message: 'Type d d\'importation invalide.' })
    @IsNotEmpty({ message: 'Le type d\'importation est obligatoire.' })
    batchType: BatchType;

    @ApiProperty({
        example: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
        description: 'ID de l\'institution concernée par l\'import',
    })
    @IsUUID('4', { message: 'L\'ID de l\'institution doit être un UUID valide.' })
    @IsNotEmpty({ message: 'L\'institution est obligatoire.' })
    institutionId: string;

    @ApiPropertyOptional({
        example: 'Importation de promotion 2025-2026',
        description: 'Description optionnelle du lot d\'importation',
    })
    @IsOptional()
    @IsString()
    description?: string;
}