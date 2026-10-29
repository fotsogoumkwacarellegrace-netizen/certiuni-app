import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty({ message: 'Le jeton de rafraîchissement (refreshToken) est obligatoire' })
    refreshToken: string;
}