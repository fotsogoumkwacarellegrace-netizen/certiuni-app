import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export class CreateAcademicYearDto {
    @ApiProperty({ example: '2025-2026', description: 'Intitulé de l\'année académique' })
    @IsString()
    @IsNotEmpty({ message: 'Le nom de l\'année académique est obligatoire.' })
    @Matches(/^\d{4}-\d{4}$/, { message: 'Le format doit être AAAA-AAAA (ex: 2025-2026).' })
    year: string;

    @ApiPropertyOptional({
        example: 'c1f2b842-8a9d-4e2a-bb33-112233445566',
        description: 'ID de l\'université (obligatoire pour Super Admin)',
    })
    @IsOptional()
    @IsUUID('4', { message: 'L\'ID de l\'université doit être un UUID v4 valide.' })
    universityId?: string;
}