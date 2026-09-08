import { UserRole } from '@prisma/client';
export declare class AttachUserDto {
    userId: string;
    universityId: string;
    role: UserRole;
}
