import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class MfaVerifyDto {
  @IsString()
  @IsNotEmpty({ message: 'Le jeton temporaire TOTP est obligatoire' })
  mfaToken: string;

  @IsString()
  @IsNotEmpty({ message: 'Le code OTP est obligatoire' })
  @Length(6, 6, { message: 'Le code OTP doit contenir exactement 6 chiffres' })
  @Matches(/^[0-9]+$/, { message: 'Le code OTP doit être composé uniquement de chiffres' })
  code: string;
}