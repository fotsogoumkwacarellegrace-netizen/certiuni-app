import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class AttachUserDto {
    @ApiProperty({
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        description: 'ID de l\'utilisateur à rattacher',
    })
    @IsUUID('4', { message: 'L\'ID utilisateur doit être un UUID v4 valide.' })
    @IsNotEmpty({ message: 'L\'ID utilisateur est obligatoire.' })
    userId: string;

    @ApiProperty({
        example: 'c1f2b842-8a9d-4e2a-bb33-112233445566',
        description: 'ID de l\'université d\'accueil',
    })
    @IsUUID('4', { message: 'L\'ID de l\'université doit être un UUID v4 valide.' })
    @IsNotEmpty({ message: 'L\'ID de l\'université est obligatoire.' })
    universityId: string;

    @ApiProperty({
        example: UserRole.UNIV_ADMIN,
        enum: UserRole,
        description: 'Rôle attribué à l\'utilisateur au sein de l\'établissement',
    })
    @IsEnum(UserRole, { message: 'Rôle utilisateur invalide.' })
    @IsNotEmpty({ message: 'Le rôle est obligatoire.' })
    role: UserRole;
}