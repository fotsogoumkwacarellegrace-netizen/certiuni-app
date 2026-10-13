import { signToken, verifyToken } from '../../src/lib/jwt';

describe('jwt lib', () => {
  it('sign + verify roundtrip', () => {
    const token = signToken({ sub: 'u1', email: 'a@b.c', role: 'ISSUER' as never, universityId: null });
    expect(typeof token).toBe('string');
    const payload = verifyToken(token);
    expect(payload.sub).toBe('u1');
    expect(payload.email).toBe('a@b.c');
  });
  it('rejects invalid token', () => {
    expect(() => verifyToken('invalid.token.here')).toThrow();
  });
  it('rejects tampered token', () => {
    const token = signToken({ sub: 'u1', email: 'a@b.c', role: 'ISSUER' as never, universityId: null });
    const tampered = token.slice(0, -2) + 'xx';
    expect(() => verifyToken(tampered)).toThrow();
  });
});
