import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export enum ServiceCategory {
    DOCUMENT_ISSUANCE = 'DOCUMENT_ISSUANCE',
    VERIFICATION = 'VERIFICATION',
    TRANSLATION = 'TRANSLATION',
    DELIVERY = 'DELIVERY',
    OTHER = 'OTHER',
}

export class CreateServiceDto {
    @ApiProperty({
        example: 'Émission d\'Attestation de Réussite Certifiée',
        description: 'Nom du service offert par CertiUni',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le nom du service est obligatoire.' })
    name: string;

    @ApiProperty({
        example: 'CERT-ISSUE-ATT',
        description: 'Code unique identifiant le service',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le code du service est obligatoire.' })
    code: string;

    @ApiPropertyOptional({
        example: 'Génération, authentification SHA-256 et délivrance numérique d\'une attestation de réussite.',
        description: 'Description détaillée du service',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: 5000,
        description: 'Prix du service (en devise locale ou unité tarifaire)',
    })
    @IsNumber({}, { message: 'Le prix doit être un nombre valide.' })
    @Min(0, { message: 'Le prix ne peut pas être négatif.' })
    price: number;

    @ApiPropertyOptional({
        example: 'XAF',
        description: 'Devise monétaire (par défaut XAF)',
    })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiProperty({
        enum: ServiceCategory,
        example: ServiceCategory.DOCUMENT_ISSUANCE,
        description: 'Catégorie fonctionnelle du service',
    })
    @IsEnum(ServiceCategory, { message: 'Catégorie de service invalide.' })
    category: ServiceCategory;

    @ApiPropertyOptional({
        example: true,
        description: 'Indique si le service est actuellement disponible à la commande',
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}