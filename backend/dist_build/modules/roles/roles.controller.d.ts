import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(dto: CreateRoleDto): Promise<{
        name: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        permissions: {
            permissionId: string;
            roleId: string;
        }[];
    }>;
    findAll(): Promise<{
        name: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        permissions: {
            permissionId: string;
            roleId: string;
        }[];
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        permissions: {
            permissionId: string;
            roleId: string;
        }[];
    }>;
    update(id: string, dto: UpdateRoleDto): Promise<{
        name: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        permissions: {
            permissionId: string;
            roleId: string;
        }[];
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
    }>;
}
