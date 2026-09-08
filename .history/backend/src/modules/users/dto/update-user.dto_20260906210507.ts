import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'] as const)) { 
    @IsOptional()
    @IsBoolean({ message: 'Le statut d\'activité doit être un booléen' })
    isActive?: boolean;

    
}