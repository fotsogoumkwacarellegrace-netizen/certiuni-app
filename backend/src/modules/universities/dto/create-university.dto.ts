import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Matches,
} from 'class-validator';

export class CreateUniversityDto {
    @ApiProperty({
        example: 'Université de Douala',
        description: "Nom officiel de l'université ou de l'institut",
    })
    @IsString()
    @IsNotEmpty({ message: "Le nom de l'université est obligatoire." })
    name!: string;

    @IsOptional()
    @IsString()
    domain?: string;

    @IsOptional()
    @IsEmail()
    contactEmail?: string;

    @ApiProperty({
        example: 'UD',
        description: 'Code ou acronyme unique (ex: UY1, UDS, UBA)',
    })
    @IsString()
    @IsNotEmpty({ message: "Le code de l'université est obligatoire." })
    @Matches(/^[A-Z0-9_-]+$/, {
        message:
            'Le code doit contenir uniquement des lettres majuscules, chiffres ou tirets.',
    })
    code!: string;

    @ApiPropertyOptional({
        example: 'Douala, Cameroun',
        description: 'Adresse physique ou localisation',
    })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({
        example: 'contact@univ-douala.cm',
        description: 'Adresse email de contact officiel',
    })
    @IsOptional()
    @IsEmail({}, { message: "Format d'email invalide." })
    email?: string;

    @ApiPropertyOptional({ example: 'https://univ-douala.cm' })
    @IsOptional()
    @IsUrl(
        { require_tld: false },
        { message: 'Le site web doit être une URL valide.' },
    )
    website?: string;

    @ApiPropertyOptional({ example: 'https://univ-douala.cm/logo.png' })
    @IsOptional()
    @IsUrl(
        { require_tld: false },
        { message: "L'URL du logo doit être valide." },
    )
    logoUrl?: string;

    @ApiPropertyOptional({
        example: true,
        description: "Statut d'activation de l'établissement",
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}