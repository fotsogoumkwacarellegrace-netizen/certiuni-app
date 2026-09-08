import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export class IssueDocumentDto {
    @ApiProperty({
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        description: 'ID du profil étudiant (Student)',
    })
    @IsUUID('4', { message: "L'ID étudiant doit être un UUID v4 valide." })
    @IsNotEmpty({ message: "L'ID étudiant est obligatoire." })
    studentId: string;

    @ApiProperty({
        example: 'b1fec999-9c0b-4ef8-bb6d-6bb9bd380a22',
        description: 'ID du type de document (DocumentType)',
    })
    @IsUUID('4', { message: "L'ID du type de document doit être un UUID v4 valide." })
    @IsNotEmpty({ message: 'Le type de document est obligatoire.' })
    documentTypeId: string;

    @ApiProperty({
        example: 'c2fed999-9c0b-4ef8-bb6d-6bb9bd380a33',
        description: "ID de l'inscription académique (Enrollment)",
    })
    @IsUUID('4', { message: "L'ID de l'inscription doit être un UUID v4 valide." })
    @IsNotEmpty({ message: "L'inscription académique est obligatoire." })
    enrollmentId: string;

    @ApiPropertyOptional({
        example: 'Licence en Informatique de Gestion',
        description: 'Intitulé spécifique affiché sur le document',
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({
        example: 'Mention Très Bien - Major de promotion',
        description: 'Mention ou distinctions honorifiques',
    })
    @IsOptional()
    @IsString()
    mention?: string;

    @ApiPropertyOptional({
        example: '2026-06-30',
        description: "Date d'émission officielle (par défaut date du jour)",
    })
    @IsOptional()
    @IsDateString({}, { message: "Date d'émission invalide." })
    issuedAt?: string;
}