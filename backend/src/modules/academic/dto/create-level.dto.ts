import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateLevelDto {
    @ApiProperty({ example: 'Licence', description: 'Nom du niveau d\'étude (Licence, Master, Doctorat)' })
    @IsString()
    @IsNotEmpty({ message: 'Le nom du niveau est obligatoire.' })
    name: string;

    @ApiProperty({ example: 'L3', description: 'Code court du niveau' })
    @IsString()
    @IsNotEmpty({ message: 'Le code du niveau est obligatoire.' })
    code: string;

    @ApiProperty({ example: 3, description: 'Rang ou année de formation (ex: 3 pour L3, 5 pour M2)' })
    @IsInt()
    @Min(1)
    rank: number;
}