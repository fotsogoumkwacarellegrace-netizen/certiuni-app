import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RevokeCertificateDto {
  @IsString()
  @IsNotEmpty({ message: 'Le motif de révocation est obligatoire' })
  @MinLength(10, { message: 'Le motif doit contenir au moins 10 caractères' })
  reason: string;
}