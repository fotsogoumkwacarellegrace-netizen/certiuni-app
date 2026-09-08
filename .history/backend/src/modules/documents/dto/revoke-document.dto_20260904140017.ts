import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RevokeDocumentDto {
    @ApiProperty({
        example: 'Erreur matérielle dans la saisie des notes du PV de délibération.',
        description: 'Motif officiel de la révocation du document certifié',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le motif de révocation est obligatoire.' })
    @MinLength(10, {
        message: 'Le motif doit contenir au moins 10 caractères pour des raisons d audit.',
    })
    reason: string;
}