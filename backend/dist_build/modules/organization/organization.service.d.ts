import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
export declare class OrganizationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly organizationInclude;
    create(dto: CreateOrganizationDto): Promise<any>;
    findAll(institutionId?: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateOrganizationDto): Promise<any>;
    remove(id: string): Promise<any>;
}
