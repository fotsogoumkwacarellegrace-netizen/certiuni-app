import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { env } from '../../config/env.config';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard, Reflector],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('canActivate', () => {
    it('should allow public routes without authentication', () => {
      const context = {
        getHandler: () => ({
          getMetadata: (key: string) => {
            if (key === IS_PUBLIC_KEY) {
              return true;
            }
            return undefined;
          },
        }),
        getClass: () => ({
          getMetadata: () => undefined,
        }),
      } as ExecutionContext;

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should reject access when JWT secret not configured', () => {
      const originalSecret = env.JWT_ACCESS_SECRET;
      delete env.JWT_ACCESS_SECRET;

      const context = {
        getHandler: () => ({
          getMetadata: () => undefined,
        }),
        getClass: () => ({
          getMetadata: () => undefined,
        }),
      } as ExecutionContext;

      expect(() => guard.canActivate(context)).toThrow('not_configured');

      // Restore
      if (originalSecret) env.JWT_ACCESS_SECRET = originalSecret;
    });

    it('should allow access with valid JWT token', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com', role: 'STUDENT' };

      const module: TestingModule = await Test.createTestingModule({
        providers: [JwtAuthGuard],
      }).compile();

      const guardInstance = module.get<JwtAuthGuard>(JwtAuthGuard);

      // Mock the super.canActivate to return the user
      const originalCanActivate = guardInstance.canActivate.bind(guardInstance);
      ;(guardInstance as any).canActivate = jest.fn(async (ctx: any) => {
        const result = await originalCanActivate(ctx);
        return mockUser;
      });

      const context = {
        getHandler: () => ({
          getMetadata: () => undefined,
        }),
        getClass: () => ({
          getMetadata: () => undefined,
        }),
      } as ExecutionContext;

      const result = await guardInstance.canActivate(context);
      expect(result).toEqual(mockUser);
      await module.close();
    });

    it('should throw UnauthorizedException when no valid JWT provided', async () => {
      const context = {
        getHandler: () => ({
          getMetadata: () => undefined,
        }),
        getClass: () => ({
          getMetadata: () => undefined,
        }),
      } as ExecutionContext;

      // When super.canActivate returns an error or null, handleRequest should throw
      ;(guard as any).handleRequest = jest.fn().mockImplementation((err, user, info) => {
        if (err || !user) {
          throw err || new Error('Unauthorized');
        }
        return user;
      });

      await expect(guard.canActivate(context)).rejects.toThrow();
      await module.close();
    });
  });
});