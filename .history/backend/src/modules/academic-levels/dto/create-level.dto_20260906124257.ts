import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export class CreateAcademicLevelDto {
    @ApiProperty({
        example: 'Licence 3',
        description: 'Intitulé du niveau académique',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le nom du niveau est obligatoire.' })
    name!: string;

    @ApiProperty({
        example: 'L3',
        description: 'Code ou acronyme court du niveau (ex: L1, L2, L3, M1, M2, DOC)',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le code du niveau est obligatoire.' })
    @Matches(/^[A-Z0-9_-]+$/, {
        message: 'Le code doit contenir uniquement des lettres majuscules, chiffres ou tirets.',
    })
    code: string;

    @ApiPropertyOptional({
        example: 'Troisième année de cycle de Licence',
        description: 'Description du niveau d\'études',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: 'c1f2b842-8a9d-4e2a-bb33-112233445566',
        description: 'ID de l\'université associée à ce niveau académique',
    })
    @IsUUID('4', { message: 'L\'ID de l\'université doit être un UUID v4 valide.' })
    @IsNotEmpty({ message: 'L\'ID de l\'université est obligatoire.' })
    universityId: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Statut du niveau académique',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}