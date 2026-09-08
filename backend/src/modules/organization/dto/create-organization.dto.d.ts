import { OrganizationType } from '../entities/organization.entity';
export declare class CreateOrganizationDto {
    institutionId: string;
    name: string;
    code: string;
    type: OrganizationType;
    description?: string;
    parentId?: string;
}
