/**
 * LoginDto — interface TypeScript (remplace la classe NestJS + class-validator).
 * La validation manuelle (émail / mot de passe) est effectuée dans le handler
 * de route `auth.controller.ts`, car `class-validator` n'est pas installé.
 */
export interface LoginDto {
  email: string;
  password: string;
}
