import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Format de courriel invalide' })
    @IsNotEmpty({ message: "L'email est obligatoire" })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
    @MinLength(8, { message: 'Le mot de passe doit comporter au moins 8 caractères' })
    password: string;
}