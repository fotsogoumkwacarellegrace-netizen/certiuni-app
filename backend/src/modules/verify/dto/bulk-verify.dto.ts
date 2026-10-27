import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BulkVerifyDto {
    @ApiProperty({
        description: 'Fichier Excel (.xlsx) ou CSV contenant une colonne "hash" avec des empreintes SHA-256',
    })
    @IsNotEmpty({ message: 'Le fichier est obligatoire.' })
    @IsString({ message: 'Le fichier doit être une chaîne de caractères (nom de fichier ou données encodées).' })
    file: string;
}
