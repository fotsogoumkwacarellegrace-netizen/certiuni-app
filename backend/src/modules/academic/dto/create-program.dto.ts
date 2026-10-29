import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProgramDto {
    @ApiProperty({ example: 'Génie Informatique', description: 'Nom de la filière/programme' })
    @IsString()
    @IsNotEmpty({ message: 'Le nom du programme est obligatoire.' })
    name: string;

    @ApiProperty({ example: 'GI', description: 'Code de la filière' })
    @IsString()
    @IsNotEmpty({ message: 'Le code du programme est obligatoire.' })
    code: string;

    @ApiPropertyOptional({ example: 'Département d\'Informatique et Télécoms', description: 'Description du programme' })
    @IsOptional()
    @IsString()
    description?: string;
}