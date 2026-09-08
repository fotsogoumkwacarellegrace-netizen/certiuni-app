import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
export declare class OrganizationController {
    private readonly organizationService;
    constructor(organizationService: OrganizationService);
    create(dto: CreateOrganizationDto): Promise<any>;
    findAll(institutionId?: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateOrganizationDto): Promise<any>;
    remove(id: string): Promise<any>;
}
