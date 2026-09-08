import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty({ example: 'Modèle Officiel - Licence Générale',description: 'Nom du modèle de document', })
  @IsString()
  @IsNotEmpty({ message: 'Le nom du template est obligatoire.' })
  name!: string;

  @ApiPropertyOptional({ example: 'Modèle utilisé pour les diplômes de Licence de la FST' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: {
      pageSize: 'A4',
      orientation: 'landscape',
      backgroundUrl: 'https://storage.certiuni.cm/templates/univ-douala-bg.png',
      fields: [
        { key: 'studentName', x: 200, y: 150, fontSize: 18, fontStyle: 'bold' },
        { key: 'degreeName', x: 200, y: 200, fontSize: 16 },
        { key: 'mention', x: 200, y: 240, fontSize: 14 },
        { key: 'qrCode', x: 700, y: 400, width: 100, height: 100 }
      ]
    }
  })
  @IsObject()
  @IsNotEmpty()
  layoutConfig!: Record<string, any>;

  @ApiPropertyOptional({ example: '9d421aa5-9cde-4b8e-b15c-05266db82158' })
  @IsUUID()
  @IsOptional()
  universityId?: string;
}