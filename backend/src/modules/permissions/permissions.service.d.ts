import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionsDto } from './dto/assign-permission.dto';
export declare class PermissionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly permissionSelect;
    create(dto: CreatePermissionDto): Promise<{
        description: string | null;
        code: string;
        id: string;
        createdAt: Date;
    }>;
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
    assignPermissionsToRole(dto: AssignPermissionsDto): Promise<{
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
    remove(id: string): Promise<{
        code: string;
        id: string;
    }>;
}
