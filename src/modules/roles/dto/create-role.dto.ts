import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({
        example: 'ACADEMIC_DIRECTOR',
        description: 'Code unique du rôle (majuscules et underscores)',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le nom du rôle est obligatoire.' })
    @Matches(/^[A-Z0-9_]+$/, {
        message: 'Le nom du rôle doit être en majuscules (ex: UNIV_ADMIN, ISSUER).',
    })
    name: string;

    @ApiPropertyOptional({
        example: 'Directeur académique pouvant signer les diplômes',
        description: 'Description détaillée des responsabilités liées au rôle',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        example: ['certificates:create', 'certificates:sign', 'users:read'],
        description: 'Liste des clefs de permissions associées au rôle',
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    permissions?: string[];
}