import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { OrganizationType } from '../entities/organization.entity';

export class CreateOrganizationDto {
  @ApiProperty({
    example: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
    description: 'ID de l institution d enseignement supérieur à laquelle rattaché l entité',
  })
  @IsUUID('4', { message: 'L ID de l institution doit être un UUID valide.' })
  @IsNotEmpty({ message: 'L institution est obligatoire.' })
  institutionId: string;

  @ApiProperty({
    example: 'Faculté des Sciences et Technologies',
    description: 'Nom de l organisation ou département',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le nom est obligatoire.' })
  name: string;

  @ApiProperty({
    example: 'FST-2026',
    description: 'Code unique de l organisation',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le code est obligatoire.' })
  code: string;

  @ApiProperty({
    enum: OrganizationType,
    example: OrganizationType.FACULTY,
    description: 'Type d unité académique ou administrative',
  })
  @IsEnum(OrganizationType, { message: 'Type d organisation invalide.' })
  @IsNotEmpty({ message: 'Le type est obligatoire.' })
  type: OrganizationType;

  @ApiPropertyOptional({
    example: 'Département en charge des diplômes en génie logiciel et IA.',
    description: 'Description détaillée',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'c3d4e5f6-a7b8-9012-3456-789abcdef012',
    description: 'ID de l organisation parente (ex: Département rattaché à une Faculté)',
  })
  @IsOptional()
  @IsUUID('4', { message: 'L ID parent doit être un UUID valide.' })
  parentId?: string;
}