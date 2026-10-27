import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRequestDto {
    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
        description: 'ID du service demandé dans le catalogue (ServiceCatalog)',
    })
    @IsUUID('4', { message: 'L\'ID du service doit être un UUID valide.' })
    @IsNotEmpty({ message: 'Le service sélectionné est obligatoire.' })
    serviceId: string;

    @ApiPropertyOptional({
        example: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
        description: 'ID de l\'inscription universitaire concernée (si applicable)',
    })
    @IsOptional()
    @IsUUID('4', { message: 'L\'ID d\'inscription doit être un UUID valide.' })
    enrollmentId?: string;

    @ApiPropertyOptional({
        example: 'Besoin urgent de ce document pour une candidature de master à l\'étranger.',
        description: 'Commentaires ou précisions ajoutés par l\'étudiant',
    })
    @IsOptional()
    @IsString()
    notes?: string;
}