import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreatePermissionDto {
    @ApiProperty({
        example: 'certificates:create',
        description: 'Code de la permission au format domaine:action',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le code de la permission est obligatoire.' })
    @Matches(/^[a-z]+:[a-z_]+$/, {
        message: 'La permission doit respecter le format domaine:action (ex: certificates:create, users:read).',
    })
    code: string;

    @ApiPropertyOptional({
        example: 'Permet de générer et d\'émettre de nouveaux diplômes',
        description: 'Description de la permission',
    })
    @IsOptional()
    @IsString()
    description?: string;
}