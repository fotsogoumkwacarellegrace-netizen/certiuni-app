import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { IssueDocumentDto } from './issue-document.dto';

export class BatchIssueDocumentDto {
    @ApiProperty({
        type: [IssueDocumentDto],
        description: "Liste des demandes d'émission de documents",
    })
    @IsArray()
    @ArrayMinSize(1, { message: 'La liste doit contenir au moins un document à émettre.' })
    @ValidateNested({ each: true })
    @Type(() => IssueDocumentDto)
    documents: IssueDocumentDto[];
}