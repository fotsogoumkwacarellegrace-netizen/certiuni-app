import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyHashDto {
    @ApiProperty({
        example: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        description: 'Empreinte numérique SHA-256 (64 caractères hexadécimaux) extraite du document PDF',
    })
    @IsString()
    @IsNotEmpty({ message: "L'empreinte numérique (hash) est obligatoire." })
    @Length(64, 64, {
        message: 'Le hash SHA-256 doit comporter exactement 64 caractères hexadécimaux.',
    })
    hash: string;
}