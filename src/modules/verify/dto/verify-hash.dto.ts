import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifyHashParamDto {
    @ApiProperty({
        example: 'a3f8b1c2d3e4f567890abcdef1234567890abcdef1234567890abcdef1234567',
        description: 'Empreinte SHA-256 du document (64 caractères hexadécimaux)',
    })
    @IsString({ message: 'Le hash doit être une chaîne de caractères.' })
    @IsNotEmpty({ message: 'Le hash est obligatoire.' })
    @Matches(/^[a-fA-F0-9]{64}$/, {
        message: 'Le format du hash SHA-256 est invalide (64 caractères hexadécimaux requis).',
    })
    hash: string;
}

export class VerifyQrDto {
    @ApiProperty({
        example: 'https://verify.certiuni.com/v/a3f8b1c2d3e4f567890abcdef1234567890abcdef1234567890abcdef1234567',
        description: 'Contenu brut ou URL décodée du QR Code',
    })
    @IsString({ message: 'Le contenu du QR code doit être une chaîne de caractères.' })
    @IsNotEmpty({ message: 'Le contenu du QR code est obligatoire.' })
    qrData: string;
}