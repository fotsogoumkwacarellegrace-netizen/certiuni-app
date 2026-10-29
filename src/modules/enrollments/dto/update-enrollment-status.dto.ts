import { ApiProperty } from '@nestjs/swagger';
import { EnrollmentStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateEnrollmentStatusDto {
  @ApiProperty({
    example: EnrollmentStatus.COMPLETED,
    enum: EnrollmentStatus,
    description: 'Statut de l\'inscription (ex: ACTIVE, COMPLETED, SUSPENDED, DROPPED)',
  })
  @IsEnum(EnrollmentStatus, { message: 'Statut d\'inscription invalide.' })
  @IsNotEmpty({ message: 'Le statut est obligatoire.' })
  status: EnrollmentStatus;
}