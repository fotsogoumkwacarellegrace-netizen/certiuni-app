import { UserRole } from '@prisma/client';

export const mockSuperAdminUser = {
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    email: 'e2e-admin@certiuni.cm',
    password: 'Password123!',
    firstName: 'E2E',
    lastName: 'Admin',
    role: UserRole.SUPER_ADMIN,
    isActive: true,
};