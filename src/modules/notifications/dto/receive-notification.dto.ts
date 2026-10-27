import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { NotificationType } from './send-notification.dto';

export class ReceiveNotificationDto {
    @ApiPropertyOptional({
        example: false,
        description: 'Filtrer par statut de lecture (true: lues, false: non lues)',
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean()
    isRead?: boolean;

    @ApiPropertyOptional({
        enum: NotificationType,
        example: NotificationType.IN_APP,
        description: 'Filtrer par type de notification',
    })
    @IsOptional()
    @IsEnum(NotificationType, { message: 'Type de notification invalide.' })
    type?: NotificationType;

    @ApiPropertyOptional({
        example: 10,
        description: 'Nombre de notifications à récupérer (pagination)',
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    limit?: number;

    @ApiPropertyOptional({
        example: 0,
        description: 'Nombre d\'éléments à sauter (pagination)',
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(0)
    offset?: number;
}