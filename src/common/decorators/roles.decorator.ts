import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export enum Role {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ISSUER = 'ISSUER',
    VERIFIER = 'VERIFIER',
}

export const Roles = (...roles: (Role | string)[]) => SetMetadata(ROLES_KEY, roles);