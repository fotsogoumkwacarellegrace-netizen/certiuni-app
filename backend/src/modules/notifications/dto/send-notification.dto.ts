import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export enum NotificationType {
    EMAIL = 'EMAIL',
    IN_APP = 'IN_APP',
    BOTH = 'BOTH',
}

export class SendNotificationDto {
    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
        description: 'ID de l\'utilisateur destinataire (User)',
    })
    @IsUUID('4', { message: 'L\'ID du destinataire doit être un UUID valide.' })
    @IsNotEmpty({ message: 'Le destinataire est obligatoire.' })
    userId: string;

    @ApiProperty({
        example: 'Votre attestation est disponible !',
        description: 'Sujet ou titre de la notification',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le titre est obligatoire.' })
    title: string;

    @ApiProperty({
        example: 'Votre demande de diplôme certifié a été approuvée et traitée avec succès.',
        description: 'Contenu du message',
    })
    @IsString()
    @IsNotEmpty({ message: 'Le message est obligatoire.' })
    message: string;

    @ApiPropertyOptional({
        enum: NotificationType,
        example: NotificationType.BOTH,
        description: 'Canal d\'envoi (EMAIL, IN_APP, BOTH)',
    })
    @IsOptional()
    @IsEnum(NotificationType, { message: 'Type de notification invalide.' })
    type?: NotificationType;
}