import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OrganizationType {
    FACULTY = 'FACULTY',
    SCHOOL = 'SCHOOL',
    UFR = 'UFR',
    DEPARTMENT = 'DEPARTMENT',
    CENTER = 'CENTER',
    CAMPUS = 'CAMPUS',
    RECRUITER = 'RECRUITER',
    OTHER = 'OTHER',
}

export class OrganizationEntity {
    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0' })
    id: string;

    @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01', description: 'ID de l institution parente' })
    institutionId: string;

    @ApiProperty({ example: 'Faculté des Sciences et Technologies' })
    name: string;

    @ApiProperty({ example: 'FST' })
    code: string;

    @ApiProperty({ enum: OrganizationType, example: OrganizationType.FACULTY })
    type: OrganizationType;

    @ApiPropertyOptional({ example: 'Faculté spécialisée dans l informatique et les sciences fondamentales.' })
    description?: string;

    @ApiPropertyOptional({ example: 'c3d4e5f6-a7b8-9012-3456-789abcdef012', description: 'ID de l organisation parente si structure imbriquée' })
    parentId?: string;

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}