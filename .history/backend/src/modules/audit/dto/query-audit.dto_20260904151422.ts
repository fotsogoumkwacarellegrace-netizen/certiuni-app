import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDateString,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

export class QueryAuditDto {
    @ApiPropertyOptional({
        example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
        description: 'Filtrer par l\'ID de l\'utilisateur ayant effectué l\'action',
    })
    @IsOptional()
    @IsUUID('4', { message: 'L\'ID utilisateur doit être un UUID valide.' })
    userId?: string;

    @ApiPropertyOptional({
        example: 'DIPLOMA_VERIFIED',
        description: 'Filtrer par type d\'action (ex: USER_LOGIN, DIPLOMA_CREATED, PAYMENT_SUCCESS)',
    })
    @IsOptional()
    @IsString()
    action?: string;

    @ApiPropertyOptional({
        example: 'ServiceRequest',
        description: 'Filtrer par entité impactée (ex: ServiceRequest, User, Diploma)',
    })
    @IsOptional()
    @IsString()
    entity?: string;

    @ApiPropertyOptional({
        example: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
        description: 'Filtrer par ID de l\'entité impactée',
    })
    @IsOptional()
    @IsString()
    entityId?: string;

    @ApiPropertyOptional({
        example: '2026-01-01T00:00:00.000Z',
        description: 'Date de début de la plage d\'audit',
    })
    @IsOptional()
    @IsDateString({}, { message: 'La date de début doit être au format ISO8601.' })
    startDate?: string;

    @ApiPropertyOptional({
        example: '2026-12-31T23:59:59.000Z',
        description: 'Date de fin de la plage d\'audit',
    })
    @IsOptional()
    @IsDateString({}, { message: 'La date de fin doit être au format ISO8601.' })
    endDate?: string;

    @ApiPropertyOptional({
        example: 50,
        description: 'Nombre de logs à récupérer (pagination)',
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