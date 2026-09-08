import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly userSelect;
    create(dto: CreateUserDto): Promise<{
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
    findByEmail(email: string): Promise<{
        role: import(".prisma/client").$Enums.UserRole;
        email: string;
        id: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        isMfaEnabled: boolean;
        mfaSecret: string | null;
        universityId: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findById(id: string): Promise<{
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
    } | null>;
    findAll(universityId?: string): Promise<{
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
    findOne(id: string): Promise<{
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
    update(id: string, dto: UpdateUserDto): Promise<{
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
