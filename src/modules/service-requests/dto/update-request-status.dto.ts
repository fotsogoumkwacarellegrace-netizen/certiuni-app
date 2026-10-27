import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ServiceRequestStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export class UpdateRequestStatusDto {
  @ApiProperty({
    enum: ServiceRequestStatus,
    example: ServiceRequestStatus.PROCESSING,
    description: 'Nouveau statut de la demande',
  })
  @IsEnum(ServiceRequestStatus, { message: 'Statut de demande invalide.' })
  @IsNotEmpty({ message: 'Le statut est obligatoire.' })
  status: ServiceRequestStatus;

  @ApiPropertyOptional({
    example: 'Demande prise en charge par le service de la scolarité.',
    description: 'Raison du rejet ou remarque du gestionnaire',
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}