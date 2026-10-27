import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

export class CreateStudentDto {
    @ApiProperty({
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        description: 'ID du compte utilisateur associé (User)',
    })
    @IsUUID('4', { message: 'L\'ID utilisateur doit être un UUID v4 valide.' })
    @IsNotEmpty({ message: 'L\'ID utilisateur est obligatoire.' })
    userId: string;

    @ApiProperty({
        example: '22U1042SF',
        description: 'Matricule officiel de l\'étudiant',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le matricule est obligatoire.' })
    matricule: string;

    @ApiProperty({
        example: '2001-05-14',
        description: 'Date de naissance (YYYY-MM-DD)',
    })
    @IsDateString({}, { message: 'Date de naissance invalide.' })
    @IsNotEmpty({ message: 'La date de naissance est obligatoire.' })
    birthDate: string;

    @ApiProperty({
        example: 'Yaoundé',
        description: 'Lieu de naissance',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le lieu de naissance est obligatoire.' })
    birthPlace: string;

    @ApiProperty({
        example: 'Camerounaise',
        description: 'Nationalité',
    })
    @IsString()
    @IsNotEmpty({ message: 'La nationalité est obligatoire.' })
    nationality: string;

    @ApiProperty({
        example: Gender.MALE,
        enum: Gender,
        description: 'Genre (MALE / FEMALE)',
    })
    @IsEnum(Gender, { message: 'Genre invalide.' })
    @IsNotEmpty({ message: 'Le genre est obligatoire.' })
    gender: Gender;

    @ApiProperty({
        example: '123456789',
        description: 'Numéro de CNI ou Passeport',
    })
    @IsOptional()
    @IsString()
    idCardNumber?: string;

    @ApiProperty({
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        description: 'ID de l\'université à laquelle l\'étudiant est rattaché',
    })
    @IsUUID('4', { message: 'L\'ID de l\'université doit être un UUID v4 valide.' })
    @IsNotEmpty({ message: 'L\'université est obligatoire.' })
    universityId: string;
}