import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly roleSelect;
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
    findByName(name: string): Promise<{
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
