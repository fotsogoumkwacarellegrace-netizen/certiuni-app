import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AuthService } from '../../src/modules/auth/auth.service';
import { createHash } from 'crypto';
import * as bcrypt from 'bcrypt';

describe('AuthService refresh tokens', () => {
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
      ],
    }).compile();
    service = module.get(AuthService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('supports login, refresh rotation, and password login without changing passwordHash', async () => {
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

    jwtService.verifyAsync.mockResolvedValue({ sub: user.id });
    const refreshed = await service.refreshToken('refresh-login');

    expect(refreshed.refreshToken).toBe('refresh-rotated');
    expect(user.passwordHash).toBe(originalPasswordHash);
    expect(user.refreshTokenHash).toBe(
      createHash('sha256').update('refresh-rotated').digest('hex'),
    );

    const relogin = await service.login({
      email: user.email,
      password: 'correct-password',
    });

    expect(relogin.refreshToken).toBe('refresh-relogin');
    expect(user.passwordHash).toBe(originalPasswordHash);
  });

  it('rejects a validly signed but revoked refresh token', async () => {
    user.refreshTokenHash = createHash('sha256')
      .update('another-refresh-token')
      .digest('hex');
    jwtService.verifyAsync.mockResolvedValue({ sub: user.id });

    await expect(service.refreshToken('revoked-refresh-token')).rejects.toThrow(
      'Jeton expiré ou invalide',
    );
  });

  it('clears the stored refresh hash on logout', async () => {
    user.refreshTokenHash = 'a'.repeat(64);

    await service.logout(user.id);

    expect(user.refreshTokenHash).toBeNull();
  });
});
