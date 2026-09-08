import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {  IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

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
    example: '<div class="diploma"><h1>{{title}}</h1><p>Décerné à {{studentName}}</p></div>',
    description: 'Code HTML source avec placeholders Handlebars',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le contenu HTML est obligatoire.' })
  htmlContent: string;

  @ApiPropertyOptional({
    example: '.diploma { font-family: "Georgia"; color: #1a365d; }',
    description: 'Styles CSS associés au template',
  })
  @IsOptional()
  @IsString()
  cssContent?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Définit si ce template est le modèle par défaut de l\'institution',
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;


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

  @ApiPropertyOptional({ example: '9d421aa5-9cde-4b8e-b15c-05266db82158',description: 'ID de l\'institution propriétaire du template', })
  @IsUUID('4', { message: 'L\'ID de l\'institution doit être un UUID valide.' })
  @IsOptional()
  @IsNotEmpty({ message: 'L\'institution est obligatoire.' })
  universityId?: string;
  
}  