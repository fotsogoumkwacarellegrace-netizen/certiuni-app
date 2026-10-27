import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export class CreateAcademicYearDto {
    @ApiProperty({
        example: '2025-2026',
        description: 'Format de l\'année académique (ex: 2025-2026)',
    })
    @IsString()
    @IsNotEmpty({ message: 'L\'intitulé de l\'année académique est obligatoire.' })
    @Matches(/^\d{4}-\d{4}$/, {
        message: 'L\'année académique doit respecter le format YYYY-YYYY (ex: 2025-2026).',
    })
    year!: string;

    @ApiPropertyOptional({
        example: '2025-09-01T00:00:00.000Z',
        description: 'Date de début de l\'année académique',
    })
    @IsOptional()
    @IsString()
    startDate?: string;

    @ApiPropertyOptional({
        example: '2026-07-31T23:59:59.000Z',
        description: 'Date de fin de l\'année académique',
    })
    @IsOptional()
    @IsString()
    endDate?: string;

    @ApiProperty({
        example: 'c1f2b842-8a9d-4e2a-bb33-112233445566',
        description: 'ID de l\'université associée à cette année académique',
    })
    @IsUUID('4', { message: 'L\'ID de l\'université doit être un UUID v4 valide.' })
    @IsNotEmpty({ message: 'L\'ID de l\'université est obligatoire.' })
    universityId!: string;
}