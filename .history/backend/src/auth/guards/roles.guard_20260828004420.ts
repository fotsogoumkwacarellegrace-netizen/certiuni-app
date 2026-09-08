import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@njs/core';
import { RoleEnum } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<RoleEnum[]>('roles', context.getHandler());
        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('Accès refusé : privilèges insuffisants pour exécuter cette action.');
        }

        return true;
    }
}