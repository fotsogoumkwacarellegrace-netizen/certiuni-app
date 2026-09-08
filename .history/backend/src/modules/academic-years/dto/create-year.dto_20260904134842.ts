import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

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
    year: string;

    @ApiPropertyOptional({
        example: '2025-09-01T00:00:00.000Z',
        description: 'Date de début de l\'année académique',
    })
    @IsOptional()
    @IsDateString({}, { message: 'Date de début invalide.' })
    startDate?: string;

    @ApiPropertyOptional({
        example: '2026-07-31T23:59:59.000Z',
        description: 'Date de fin de l\'année académique',
    })
    @IsOptional()
    @IsDateString({}, { message: 'Date de fin invalide.' })
    endDate?: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Indique s\'il s\'agit de l\'année académique courante/active',
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    isCurrent?: boolean;
}