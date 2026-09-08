import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsUUID,
    IsOptional,
    IsObject,
    IsDateString,
} from 'class-validator';

export class IssueCertificateDto {
    @ApiProperty({ description: 'ID du modèle de diplôme à utiliser' })
    @IsUUID()
    @IsNotEmpty()
    templateId: string;

    @ApiProperty({ description: 'Nom complet de l étudiant', example: 'Mballa Jean Paul' })
    @IsString()
    @IsNotEmpty()
    studentName: string;

    @ApiProperty({ description: 'Matricule de l étudiant', example: '21U2891' })
    @IsString()
    @IsNotEmpty()
    studentMatricule: string;

    @ApiProperty({ description: 'Intitulé du diplôme', example: 'Licence en Informatique' })
    @IsString()
    @IsNotEmpty()
    degreeTitle: string;

    @ApiProperty({ description: 'Filière / Spécialité', example: 'Génie Logiciel' })
    @IsString()
    @IsNotEmpty()
    fieldOfStudy: string;

    @ApiProperty({ description: 'Mention obtenue', example: 'Très Bien' })
    @IsString()
    @IsNotEmpty()
    grade: string;

    @ApiProperty({ description: 'Date d obtention', example: '2026-07-15' })
    @IsDateString()
    @IsNotEmpty()
    issueDate: string;

    @ApiPropertyOptional({ description: 'Données supplémentaires dynamiques' })
    @IsObject()
    @IsOptional()
    metadata?: Record<string, any>;
}