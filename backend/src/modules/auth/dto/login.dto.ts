/**
 * LoginDto — interface TypeScript (remplace la classe NestJS + class-validator).
 * La validation manuelle (émail / mot de passe) est effectuée dans le handler
 * de route `auth.controller.ts`, car `class-validator` n'est pas installé.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'superadmin@certiuni.cm', description: 'Adresse e-mail de l’utilisateur' })
  @IsEmail({}, { message: 'Veuillez fournir une adresse e-mail valide' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'MotDePasseSécurisé123!', description: 'Mot de passe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  password!: string;
}
