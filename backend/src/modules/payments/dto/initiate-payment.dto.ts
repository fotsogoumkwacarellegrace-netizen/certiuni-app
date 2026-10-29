import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class InitiatePaymentDto {
    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
        description: 'ID de la demande à régler. Le montant est calculé côté serveur.',
    })
    @IsUUID('4', { message: "L'ID de la demande doit être un UUID valide." })
    @IsNotEmpty({ message: 'La demande de service est obligatoire.' })
    requestId: string;
}
