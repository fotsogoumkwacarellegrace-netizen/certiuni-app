import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength, Matches, } from 'class-validator';
import { Role } from '../common/decorators/roles.decorator';

export class CreateUserDto {
    @ApiProperty({ example: 'admin@univ-douala.cm' })
    @IsEmail({}, { message: 'Adresse email invalide' })
    @IsNotEmpty({ message: 'L\'email est obligatoire' })
    email!: string;

    @ApiProperty({ example: 'MotDePasseFort2026!' })
    @IsString()
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    password!: string;

    @ApiProperty({ example: 'Paul' })
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @ApiProperty({ example: 'Eboa' })
    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @ApiProperty({ enum: UserRole, example: UserRole.UNIV_ADMIN })
    @IsEnum(UserRole)
    role!: UserRole;

    @ApiPropertyOptional({ example: '9d421aa5-9cde-4b8e-b15c-05266db82158' })
    @IsUUID()
    @IsOptional()
    universityId?: string;
}