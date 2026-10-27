import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MfaEnrollDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class MfaVerifyTokenDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    @IsNotEmpty()
    code: string;
}

export class MfaDisableDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsString()
    @IsNotEmpty()
    userId: string;
}
