import { PrismaService } from '../prisma/prisma.service';
import { AttachUserDto } from './dto/attach-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
export declare class UniversityUsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly userSelect;
    attachUser(dto: AttachUserDto): Promise<{
        role: import(".prisma/client").$Enums.UserRole;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        universityId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByUniversity(universityId: string): Promise<{
        role: import(".prisma/client").$Enums.UserRole;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        universityId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateUserRole(userId: string, universityId: string, dto: UpdateUserRoleDto): Promise<{
        role: import(".prisma/client").$Enums.UserRole;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        universityId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    detachUser(userId: string, universityId: string): Promise<{
        role: import(".prisma/client").$Enums.UserRole;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        universityId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
