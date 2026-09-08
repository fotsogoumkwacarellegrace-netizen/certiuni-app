import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(currentUser: any, dto: CreateUserDto): Promise<{
        role: import(".prisma/client").$Enums.UserRole;
        university: {
            code: string;
            name: string;
            id: string;
        } | null;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        universityId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(currentUser: any, universityId?: string): Promise<{
        role: import(".prisma/client").$Enums.UserRole;
        university: {
            code: string;
            name: string;
            id: string;
        } | null;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        universityId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(currentUser: any, id: string): Promise<{
        role: import(".prisma/client").$Enums.UserRole;
        university: {
            code: string;
            name: string;
            id: string;
        } | null;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        universityId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(currentUser: any, id: string, dto: UpdateUserDto): Promise<{
        role: import(".prisma/client").$Enums.UserRole;
        university: {
            code: string;
            name: string;
            id: string;
        } | null;
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        universityId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        email: string;
        id: string;
    }>;
}
