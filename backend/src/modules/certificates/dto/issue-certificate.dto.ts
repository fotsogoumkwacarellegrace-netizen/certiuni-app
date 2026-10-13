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
    templateId!: string;

    @ApiProperty({ description: 'Prénom de l étudiant', example: 'Jean' })
    @IsString()
    @IsNotEmpty()
    studentFirstName!: string;

    @ApiProperty({ description: 'Nom de l étudiant', example: 'Paul' })
    @IsString()
    @IsNotEmpty()
    studentLastName!: string;

    @ApiProperty({ description: 'Matricule de l étudiant', example: '21U2891' })
    @IsString()
    @IsNotEmpty()
    studentMatricule!: string;

    @ApiProperty({ description: 'Intitulé du diplôme', example: 'Licence en Informatique' })
    @IsString()
    @IsNotEmpty()
    degreeTitle!: string;

    @ApiProperty({ description: 'Filière / Spécialité', example: 'Génie Logiciel' })
    @IsString()
    @IsNotEmpty()
    fieldOfStudy!: string;

    @ApiProperty({ description: 'Mention obtenue', example: 'Très Bien' })
    @IsString()
    @IsNotEmpty()
    grade!: string;

    @ApiProperty({ description: 'Date d obtention', example: '2026-07-15' })
    @IsDateString()
    @IsNotEmpty()
    issueDate!: string;

    @ApiPropertyOptional({ description: 'ID de l\'université émettrice (optionnel si l\'utilisateur est rattaché)' })
    @IsOptional()
    @IsUUID()
    universityId?: string;

    @ApiPropertyOptional({ description: 'ID de l\'étudiant lié (optionnel si données libres)' })
    @IsOptional()
    @IsUUID()
    studentId?: string;

    @ApiPropertyOptional({ description: 'ID du programme / filière' })
    @IsOptional()
    @IsUUID()
    programId?: string;

    @ApiPropertyOptional({ description: 'ID de l\'année académique' })
    @IsOptional()
    @IsUUID()
    academicYearId?: string;

    @ApiPropertyOptional({ description: 'ID du niveau académique' })
    @IsOptional()
    @IsUUID()
    academicLevelId?: string;

    @ApiPropertyOptional({ description: 'Données supplémentaires au format JSON' })
    @IsObject()
    @IsOptional()
    metadataJson?: Record<string, any>;
}