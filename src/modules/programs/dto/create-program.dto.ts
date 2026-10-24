import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    Matches,
} from 'class-validator';

export class CreateProgramDto {
    @ApiProperty({
        example: 'Génie Informatique',
        description: 'Nom de la filière ou de la spécialité',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le nom du programme est obligatoire.' })
    name: string;

    @ApiProperty({
        example: 'GI-BS',
        description: 'Code ou acronyme unique de la filière (ex: GI-BS, SEG, DROT)',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le code du programme est obligatoire.' })
    @Matches(/^[A-Z0-9_-]+$/, {
        message: 'Le code doit contenir uniquement des lettres majuscules, chiffres ou tirets.',
    })
    code: string;

    @ApiPropertyOptional({
        example: 'Licence / Bachelor in Computer Engineering',
        description: 'Description détaillée ou objectifs de la formation',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: 'c1f2b842-8a9d-4e2a-bb33-112233445566',
        description: 'ID de l\'université proposant cette filière',
    })
    @IsUUID('4', { message: 'L\'ID de l\'université doit être un UUID v4 valide.' })
    @IsNotEmpty({ message: 'L\'ID de l\'université est obligatoire.' })
    universityId: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Statut de la filière',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}