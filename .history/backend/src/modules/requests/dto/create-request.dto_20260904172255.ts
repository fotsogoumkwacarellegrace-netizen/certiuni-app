import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRequestDto {
    @ApiProperty({ example: 'Jean Dupont', description: 'Nom complet du demandeur (tier/recruteur)' })
    @IsString()
    @IsNotEmpty({ message: 'Le nom du demandeur est obligatoire.' })
    requesterName: string;

    @ApiProperty({ example: 'contact@entreprise.com', description: 'Email de contact pour recevoir la réponse' })
    @IsEmail({}, { message: 'L\'adresse email doit être valide.' })
    @IsNotEmpty({ message: 'L\'email du demandeur est obligatoire.' })
    requesterEmail: string;

    @ApiPropertyOptional({ example: 'Tech Solutions Inc.', description: 'Nom de la structure ou de l\'entreprise' })
    @IsOptional()
    @IsString()
    organization?: string;

    @ApiProperty({
        example: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
        description: 'ID de l\'université concernée par la demande',
    })
    @IsUUID('4', { message: 'L\'ID de l\'université doit être un UUID valide.' })
    @IsNotEmpty({ message: 'L\'université est obligatoire.' })
    universityId: string;

    @ApiPropertyOptional({
        example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        description: 'Hash SHA-256 du document à vérifier (si disponible)',
    })
    @IsOptional()
    @IsString()
    documentHash?: string;

    @ApiPropertyOptional({
        example: 'Demande de vérification pour le recrutement au poste d\'ingénieur.',
        description: 'Motif ou message complémentaire',
    })
    @IsOptional()
    @IsString()
    reason?: string;
}