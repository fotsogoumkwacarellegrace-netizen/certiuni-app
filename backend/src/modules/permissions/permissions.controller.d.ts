import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionsDto } from './dto/assign-permission.dto';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    create(dto: CreatePermissionDto): Promise<{
        description: string | null;
        code: string;
        id: string;
        createdAt: Date;
    }>;
    assignPermissions(dto: AssignPermissionsDto): Promise<{
        name: string;
        id: string;
        updatedAt: Date;
        permissions: {
            permission: {
                code: string;
                id: string;
            };
        }[];
    } | null>;
    findAll(): Promise<{
        description: string | null;
        code: string;
        id: string;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        description: string | null;
        code: string;
        id: string;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        code: string;
        id: string;
    }>;
}
