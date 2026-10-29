import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

export class CreateTariffDto {
    @ApiProperty({
        example: 'Grille Tarifaire Attestations - Douala',
        description: 'Nom descriptif de la grille ou règle tarifaire',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le nom du tarif est obligatoire.' })
    name: string;

    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
        description: 'ID du service concerné dans le catalogue (ServiceCatalog)',
    })
    @IsUUID('4', { message: 'L\'ID du service doit être un UUID valide.' })
    @IsNotEmpty({ message: 'Le service est obligatoire.' })
    serviceId: string;

    @ApiPropertyOptional({
        example: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
        description: 'ID de l\'université concernée (si tarif spécifique à un établissement)',
    })
    @IsOptional()
    @IsUUID('4', { message: 'L\'ID de l\'université doit être un UUID valide.' })
    universityId?: string;

    @ApiProperty({
        example: 7500,
        description: 'Montant applique pour ce tarif',
    })
    @IsNumber({}, { message: 'Le montant doit être un nombre valide.' })
    @Min(0, { message: 'Le montant ne peut pas être négatif.' })
    amount: number;

    @ApiPropertyOptional({
        example: 'XAF',
        description: 'Devise monétaire (par défaut XAF)',
    })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Indique si cette règle tarifaire est active',
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}