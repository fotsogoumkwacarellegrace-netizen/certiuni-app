import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateEnrollmentDto {
    @ApiProperty({
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        description: 'ID de l\'étudiant (User)',
    })
    @IsUUID('4', { message: 'L\'ID de l\'étudiant doit être un UUID v4 valide.' })
    @IsNotEmpty({ message: 'L\'ID de l\'étudiant est obligatoire.' })
    studentId: string;

    @ApiProperty({
        example: 'c1f2b842-8a9d-4e2a-bb33-112233445566',
        description: 'ID du programme / filière d\'études',
    })
    @IsUUID('4', { message: 'L\'ID du programme doit être un UUID v4 valide.' })
    @IsNotEmpty({ message: 'L\'ID du programme est obligatoire.' })
    programId: string;

    @ApiProperty({
        example: 'd2a3c953-9b1c-4f3a-cc44-223344556677',
        description: 'ID du niveau académique (ex: L3, M1)',
    })
    @IsUUID('4', { message: 'L\'ID du niveau académique doit être un UUID v4 valide.' })
    @IsNotEmpty({ message: 'L\'ID du niveau académique est obligatoire.' })
    academicLevelId: string;

    @ApiProperty({
        example: 'e3b4d064-0c2d-5a4b-dd55-334455667788',
        description: 'ID de l\'année académique (ex: 2025-2026)',
    })
    @IsUUID('4', { message: 'L\'ID de l\'année académique doit être un UUID v4 valide.' })
    @IsNotEmpty({ message: 'L\'ID de l\'année académique est obligatoire.' })
    academicYearId: string;
}