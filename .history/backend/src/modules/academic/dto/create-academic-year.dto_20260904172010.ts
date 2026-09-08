import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateAcademicYearDto {
    @ApiProperty({ example: '2025-2026', description: 'Intitulé de l\'année académique' })
    @IsString()
    @IsNotEmpty({ message: 'Le nom de l\'année académique est obligatoire.' })
    @Matches(/^\d{4}-\d{4}$/, { message: 'Le format doit être AAAA-AAAA (ex: 2025-2026).' })
    name: string;

    @ApiProperty({ example: '2025-10-01T00:00:00.000Z', description: 'Date de début de l\'année' })
    @IsDateString({}, { message: 'La date de début doit être une date ISO valide.' })
    @IsNotEmpty()
    startDate: string;

    @ApiProperty({ example: '2026-07-31T00:00:00.000Z', description: 'Date de fin de l\'année' })
    @IsDateString({}, { message: 'La date de fin doit être une date ISO valide.' })
    @IsNotEmpty()
    endDate: string;
}