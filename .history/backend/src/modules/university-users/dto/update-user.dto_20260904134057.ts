import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateUserRoleDto {
    @ApiProperty({
        example: UserRole.VERIFIER,
        enum: UserRole,
        description: 'Nouveau rôle à assigner à l\'utilisateur',
    })
    @IsEnum(UserRole, { message: 'Rôle utilisateur invalide.' })
    @IsNotEmpty({ message: 'Le rôle est obligatoire.' })
    role: UserRole;
}