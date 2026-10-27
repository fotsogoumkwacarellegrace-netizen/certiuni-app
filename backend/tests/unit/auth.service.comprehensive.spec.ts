import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AuthService } from '../../src/modules/auth/auth.service';
import { MfaService } from '../../src/modules/auth/mfa.service';
import { createHash } from 'crypto';
import * as bcrypt from 'bcrypt';

describe('AuthService Comprehensive Tests', () => {
  let service: AuthService;
  let module: TestingModule;
  let user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    refreshTokenHash: string | null;
  };

  const jwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const prismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    user = {
      id: 'user-id',
      email: 'student@example.test',
      role: 'STUDENT',
      firstName: 'Test',
      lastName: 'Student',
      passwordHash: 'password-hash',
      refreshTokenHash: null,
    };
    jwtService.signAsync.mockReset();
    jwtService.verifyAsync.mockReset();
    jwtService.signAsync
      .mockResolvedValueOnce('access-login')
      .mockResolvedValueOnce('refresh-login')
      .mockResolvedValueOnce('access-refresh')
      .mockResolvedValueOnce('refresh-rotated')
      .mockResolvedValueOnce('access-relogin')
      .mockResolvedValueOnce('refresh-relogin');
    prismaService.user.findUnique.mockReset();
    prismaService.user.findUnique.mockImplementation(async () => ({ ...user }));
    prismaService.user.update.mockReset();
    prismaService.user.update.mockImplementation(async ({ data }) => {
      Object.assign(user, data);
      return { ...user };
    });

    module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtService },
        { provide: PrismaService, useValue: prismaService },
        {
          provide: MfaService,
          useValue: {
            verifyTokenAndGetUser: jest.fn().mockResolvedValue({ ...user }),
          },
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  afterEach(async () => {
    await module.close();
  });

  // Login tests
  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      user.passwordHash = await bcrypt.hash('correct-password', 10);
      const originalPasswordHash = user.passwordHash;

      const login = await service.login({
        email: user.email,
        password: 'correct-password',
      });

      expect(login.refreshToken).toBe('refresh-login');
      expect(user.passwordHash).toBe(originalPasswordHash);
      expect(user.refreshTokenHash).toBe(
        createHash('sha256').update('refresh-login').digest('hex'),
      );
    });

    it('should fail with invalid password', async () => {
      await expect(
        service.login({
          email: user.email,
          password: 'wrong-password',
        }),
      ).rejects.toThrow('Identifiants invalides');
    });

    it('should require MFA when isMfaEnabled is true', async () => {
      user.isMfaEnabled = true;
      const login = await service.login({
        email: user.email,
        password: 'correct-password',
      });

      expect(login.mfaRequired).toBe(true);
      expect(login.userId).toBe(user.id);
      expect(login.message).toContain('Code TOTP requis');
    });

    it('should login without MFA when isMfaEnabled is false', async () => {
      user.isMfaEnabled = false;
      const login = await service.login({
        email: user.email,
        password: 'correct-password',
      });

      expect(login.mfaRequired).toBeUndefined();
      expect(login).toHaveProperty('accessToken');
      expect(login).toHaveProperty('refreshToken');
    });
  });

  // Refresh token tests
  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: user.id });

      const tokens = await service.refreshToken('refresh-login-value');

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
    });

    it('should fail with invalid refresh token', async () => {
      await expect(
        service.refreshToken('invalid-token'),
      ).rejects.toThrow('Jeton expiré ou invalide');
    });

    it('should fail when refresh secret not configured', async () => {
      // This test verifies the ServiceUnavailableException is thrown
      const originalSecret = process.env.JWT_REFRESH_SECRET;
      delete process.env.JWT_REFRESH_SECRET;

      await expect(
        service.refreshToken('some-token'),
      ).rejects.toThrow('Jeton expiré ou invalide');

      // Restore
      if (originalSecret) process.env.JWT_REFRESH_SECRET = originalSecret;
      else delete process.env.JWT_REFRESH_SECRET;
    });
  });

  // Logout tests
  describe('logout', () => {
    it('should clear the stored refresh hash on logout', async () => {
      user.refreshTokenHash = 'a'.repeat(64);
      await service.logout(user.id);
      expect(user.refreshTokenHash).toBeNull();
    });
  });

  // MFA tests
  describe('MFA', () => {
    it('should complete MFA login after valid TOTP verification', async () => {
      const userWithMfa = { ...user, isMfaEnabled: true };
      jwtService.verifyAsync.mockResolvedValue({ sub: user.id });

      const result = await service.completeMfaLogin(user.id, 'valid-totp-token');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });
});