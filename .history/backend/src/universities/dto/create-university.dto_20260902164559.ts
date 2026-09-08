import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUniversityDto {
    @ApiProperty({ example: 'Université de Douala' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: 'UDLA' })
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