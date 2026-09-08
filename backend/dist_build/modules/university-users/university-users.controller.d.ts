import { UniversityUsersService } from './university-users.service';
import { AttachUserDto } from './dto/attach-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
export declare class UniversityUsersController {
    private readonly universityUsersService;
    constructor(universityUsersService: UniversityUsersService);
    attachUser(dto: AttachUserDto): Promise<{
        role: import(".prisma/client").$Enums.UserRole;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        universityId: string;
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
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateUserRole(universityId: string, userId: string, dto: UpdateUserRoleDto): Promise<{
        role: import(".prisma/client").$Enums.UserRole;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    detachUser(universityId: string, userId: string): Promise<{
        role: import(".prisma/client").$Enums.UserRole;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        universityId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
