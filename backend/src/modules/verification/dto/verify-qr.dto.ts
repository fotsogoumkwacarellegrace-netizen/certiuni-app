import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class VerifyQrDto {
    @ApiProperty({
        example: 'CERT-2026-X9A2B4C',
        description: 'Numéro de certificat ou contenu encodé dans le QR Code',
    })
    @IsString()
    @MaxLength(2048)
    @IsNotEmpty({ message: 'Le numéro de certificat ou la donnée QR est obligatoire.' })
    qrData: string;
}