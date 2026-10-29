import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

export enum PaymentProvider {
    MTN_MOMO = 'MTN_MOMO',
    ORANGE_MONEY = 'ORANGE_MONEY',
    STRIPE = 'STRIPE',
    CREDIT_CARD = 'CREDIT_CARD',
    CASH = 'CASH',
}

export class InitiatePaymentDto {
    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
        description: 'ID de la demande de service (ServiceRequest) à régler',
    })
    @IsUUID('4', { message: 'L\'ID de la demande de service doit être un UUID valide.' })
    @IsNotEmpty({ message: 'La demande de service est obligatoire.' })
    requestId: string;

    @ApiProperty({
        example: 5000,
        description: 'Montant à payer',
    })
    @IsNumber({}, { message: 'Le montant doit être un nombre valide.' })
    @Min(100, { message: 'Le montant minimum est de 100.' })
    amount: number;

    @ApiProperty({
        enum: PaymentProvider,
        example: PaymentProvider.MTN_MOMO,
        description: 'Mode ou fournisseur de paiement',
    })
    @IsEnum(PaymentProvider, { message: 'Mode de paiement invalide.' })
    provider: PaymentProvider;

    @ApiPropertyOptional({
        example: '+237670000000',
        description: 'Numéro de téléphone pour le prélèvement Mobile Money',
    })
    @IsOptional()
    @IsString()
    phoneNumber?: string;
}