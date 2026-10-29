import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export class CheckAccessDto {
    @ApiProperty({
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        description: 'ID de l\'utilisateur dont on souhaite vérifier les accès',
    })
    @IsUUID('4', { message: 'L\'ID utilisateur doit être un UUID v4 valide.' })
    @IsNotEmpty({ message: 'L\'ID utilisateur est obligatoire.' })
    userId: string;

    @ApiProperty({
        example: 'certificates:create',
        description: 'Permission ciblée (format domaine:action)',
    })
    @IsString()
    @IsNotEmpty({ message: 'La permission est obligatoire.' })
    @Matches(/^[a-z]+:[a-z_]+$/, {
        message: 'La permission doit respecter le format domaine:action (ex: certificates:create).',
    })
    permission: string;

    @ApiPropertyOptional({
        example: 'c1f2b842-8a9d-4e2a-bb33-112233445566',
        description: 'ID de l\'université contextuelle pour la validation multi-tenant',
    })
    @IsOptional()
    @IsUUID('4', { message: 'L\'ID de l\'université doit être un UUID v4 valide.' })
    universityId?: string;
}