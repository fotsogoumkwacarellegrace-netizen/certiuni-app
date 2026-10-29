import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MinLength,
    Matches,
} from 'class-validator';
import { Role } from '../../../common/decorators/roles.decorator';

export class RegisterDto {
    @IsEmail({}, { message: 'Adresse email invalide' })
    @IsNotEmpty({ message: 'L\'email est obligatoire' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre/caractère spécial',
    })
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Le prénom est obligatoire' })
    firstName: string;

    @IsString()
    @IsNotEmpty({ message: 'Le nom est obligatoire' })
    lastName: string;

    @IsEnum(Role, { message: 'Le rôle attribué est invalide' })
    @IsNotEmpty({ message: 'Le rôle est obligatoire' })
    role: Role;

    @IsOptional()
    @IsUUID('4', { message: 'L\'identifiant de l\'université doit être un UUID v4 valide' })
    universityId?: string;
}