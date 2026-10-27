import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from '../guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesGuard, Reflector],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('canActivate', () => {
    it('should allow access when no roles required', () => {
      const context = {
        getHandler: () => ({
          getMetadata: () => undefined,
        }),
        getClass: () => ({
          getMetadata: () => undefined,
        }),
      } as ExecutionContext;

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow access when user has required role', () => {
      const context = {
        getHandler: () => ({
          getMetadata: (key: string) => {
            if (key === 'roles') {
              return [UserRole.SUPER_ADMIN];
            }
            return undefined;
          },
        }),
        getClass: () => ({
          getMetadata: () => undefined,
        }),
      } as ExecutionContext;

      // Mock the user with SUPER_ADMIN role
      const request = {
        user: { role: UserRole.SUPER_ADMIN },
      };
      ;(context.switchToHttp = jest.fn().mockReturnValue({ getRequest: () => request }))();

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should throw ForbiddenException when user lacks required role', () => {
      const context = {
        getHandler: () => ({
          getMetadata: (key: string) => {
            if (key === 'roles') {
              return [UserRole.SUPER_ADMIN];
            }
            return undefined;
          },
        }),
        getClass: () => ({
          getMetadata: () => undefined,
        }),
      } as ExecutionContext;

      const request = {
        user: { role: UserRole.STUDENT },
      };
      ;(context.switchToHttp = jest.fn().mockReturnValue({ getRequest: () => request }))();

      expect(() => guard.canActivate(context)).toThrow(
        'Privilèges insuffisants (STUDENT) pour cette opération',
      );
    });

    it('should allow UNIV_ADMIN for operations requiring UNIV_ADMIN or SUPER_ADMIN', () => {
      const context = {
        getHandler: () => ({
          getMetadata: (key: string) => {
            if (key === 'roles') {
              return [UserRole.SUPER_ADMIN, UserRole.UNIV_ADMIN];
            }
            return undefined;
          },
        }),
        getClass: () => ({
          getMetadata: () => undefined,
        }),
      } as ExecutionContext;

      const request = {
        user: { role: UserRole.UNIV_ADMIN },
      };
      ;(context.switchToHttp = jest.fn().mockReturnValue({ getRequest: () => request }))();

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow STUDENT for public operations', () => {
      const context = {
        getHandler: () => ({
          getMetadata: (key: string) => {
            if (key === 'roles') {
              return [UserRole.SUPER_ADMIN];
            }
            return undefined;
          },
        }),
        getClass: () => ({
          getMetadata: () => undefined,
        }),
      } as ExecutionContext;

      // Mock without user.role - should throw
      const request = {
        user: {},
      };
      ;(context.switchToHttp = jest.fn().mockReturnValue({ getRequest: () => request }))();

      expect(() => guard.canActivate(context)).toThrow(
        'Accès refusé : Rôle non identifié',
      );
    });
  });
});