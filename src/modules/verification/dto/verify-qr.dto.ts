import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifyQrDto {
    @ApiProperty({
        example: 'CERT-2026-X9A2B4C',
        description: 'Numéro de certificat ou contenu encodé dans le QR Code',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le numéro de certificat ou la donnée QR est obligatoire.' })
    @Matches(/^[A-Z0-9\-_:/.]+$/i, {
        message: 'Format de numéro ou donnée de vérification invalide.',
    })
    qrData: string;
}