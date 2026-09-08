import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, } from 'class-validator';

export class CreateUniversityDto {
    @ApiProperty({ example: 'Université de Douala', description: 'Nom officiel de l\'université ou de l\'institut', })
    @IsString()
    @IsNotEmpty({ message: 'Le nom de l\'université est obligatoire.' })
    name!: string;

    @ApiProperty({ example: 'UD', description: 'Code ou acronyme unique (ex: UY1, UDS, UBA)', })
    @IsString()
    @IsNotEmpty({ message: 'Le code de l\'université est obligatoire.' })
    @Matches(/^[A-Z0-9_-]+$/, {
        message: 'Le code doit contenir uniquement des lettres majuscules, chiffres ou tirets.',
    })
    code!: string;

    

    @ApiPropertyOptional({ example: 'https://univ-douala.cm' })
    @IsUrl()
    @IsOptional()
    @IsEmail({}, { message: 'Format d\'email invalide.' })
    website?: string;

    @ApiPropertyOptional({ example: 'https://univ-douala.cm/logo.png' })
    @IsUrl()
    @IsOptional()
    logoUrl?: string;
}