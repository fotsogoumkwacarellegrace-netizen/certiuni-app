import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
    @ApiPropertyOptional({
        example: 'documents/certificates',
        description: 'Dossier virtuel de destination dans le bucket S3/MinIO',
    })
    @IsOptional()
    @IsString()
    folder?: string;
}