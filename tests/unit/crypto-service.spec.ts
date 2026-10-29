import { CryptoService } from '../../src/services/crypto.service';

describe('CryptoService', () => {
  it('hash deterministe 64hex', () => {
    const p = { studentIdentifier: 'ETU1', degreeTitle: 'Licence', issueDate: '2026-01-01', universityId: 'U1' };
    const h1 = CryptoService.calculateCanonicalHash(p);
    const h2 = CryptoService.calculateCanonicalHash(p);
    expect(h1).toBe(h2);
    expect(h1).toMatch(/^[a-f0-9]{64}$/);
  });
  it('verifyHash true/false', () => {
    const d = { studentIdentifier: 'ETU1', degreeTitle: 'Licence', issueDate: '2026-01-01', universityId: 'U1' };
    const h = CryptoService.calculateCanonicalHash(d);
    expect(CryptoService.verifyHash(d, h)).toBe(true);
    expect(CryptoService.verifyHash({ ...d, degreeTitle: 'Master' }, h)).toBe(false);
  });
  it('bufferHash 64hex', () => {
    expect(CryptoService.calculateBufferHash(Buffer.from('abc'))).toMatch(/^[a-f0-9]{64}$/);
  });
});
