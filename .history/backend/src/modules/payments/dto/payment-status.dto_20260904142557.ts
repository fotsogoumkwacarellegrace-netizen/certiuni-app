import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export class PaymentStatusDto {
  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.SUCCESSFUL,
    description: 'Statut du paiement',
  })
  @IsEnum(PaymentStatus, { message: 'Statut de paiement invalide.' })
  @IsNotEmpty({ message: 'Le statut est obligatoire.' })
  status: PaymentStatus;

  @ApiPropertyOptional({
    example: 'TXN-2026-889412',
    description: 'Référence de transaction générée par l\'opérateur',
  })
  @IsOptional()
  @IsString()
  transactionRef?: string;

  @ApiPropertyOptional({
    example: 'Paiement confirmé avec succès.',
    description: 'Message de retour ou motif d\'échec',
  })
  @IsOptional()
  @IsString()
  note?: string;
}