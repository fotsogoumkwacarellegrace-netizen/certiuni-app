import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RevokeCertificateDto {
  @ApiProperty({
    description: 'Raison de la révocation du diplôme',
    example: 'Erreur administrative dans le nom de l étudiant',
  })
  @IsString()
  @IsNotEmpty()
  reason!: string;
}