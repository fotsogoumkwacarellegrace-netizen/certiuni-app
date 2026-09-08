import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUniversityDto {
    @ApiProperty({ example: 'Université de Douala', description: 'Nom officiel de l\'université ou de l\'institut', })
    @IsString()
    @IsNotEmpty({ message: 'Le nom de l\'université est obligatoire.' })
    name!: string;

    @ApiProperty({ example: 'UD', })
    @IsString()
    @IsNotEmpty()
    code!: string;

    @ApiPropertyOptional({ example: 'https://univ-douala.cm' })
    @IsUrl()
    @IsOptional()
    website?: string;

    @ApiPropertyOptional({ example: 'https://univ-douala.cm/logo.png' })
    @IsUrl()
    @IsOptional()
    logoUrl?: string;
}