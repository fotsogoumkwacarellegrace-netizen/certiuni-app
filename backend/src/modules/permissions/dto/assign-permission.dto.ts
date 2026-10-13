import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AssignPermissionsDto {
    @ApiProperty({
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        description: 'ID unique du rôle auquel assigner les permissions',
    })
    @IsUUID('4', { message: 'L\'ID du rôle doit être un UUID v4 valide.' })
    @IsNotEmpty({ message: 'L\'ID du rôle est obligatoire.' })
    roleId: string;

    @ApiProperty({
        example: ['certificates:create', 'certificates:verify', 'users:read'],
        description: 'Liste des codes de permissions à attribuer au rôle',
        type: [String],
    })
    @IsArray({ message: 'Les permissions doivent être fournies sous forme de tableau.' })
    @IsString({ each: true, message: 'Chaque permission doit être une chaîne de caractères.' })
    permissions: string[];
}