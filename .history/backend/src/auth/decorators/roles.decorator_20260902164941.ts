import type { RequestHandler } from 'express';
import { RoleEnum } from '@prisma/client';
import { authorizeRoles } from '../../middlewares/role.middleware';

/**
 * `@Roles(...)` NestJS (SetMetadata + RolesGuard) -> middleware Express.
 * Applique `authorizeRoles`, qui s'appuie sur `req.user` positionné par le
 * middleware `authenticateJWT`. Contrairement a NestJS, le role est verifie
 * directement dans la chaine de middlewares de la route.
 */
export const Roles = (...roles: RoleEnum[]): RequestHandler =>
  authorizeRoles(...roles);

export default Roles;import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);