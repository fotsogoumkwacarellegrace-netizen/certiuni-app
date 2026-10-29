import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum RequestStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export class UpdateRequestStatusDto {
    @ApiProperty({
        enum: RequestStatus,
        example: RequestStatus.APPROVED,
        description: 'Nouveau statut de la demande',
    })
    @IsEnum(RequestStatus, { message: 'Le statut fourni est invalide.' })
    @IsNotEmpty({ message: 'Le statut est obligatoire.' })
    status: RequestStatus;

    @ApiPropertyOptional({
        example: 'Le diplôme a été authentifié avec succès dans le registre officiel.',
        description: 'Remarques ou motifs en cas de rejet/validation',
    })
    @IsOptional()
    @IsString()
    adminNotes?: string;
}