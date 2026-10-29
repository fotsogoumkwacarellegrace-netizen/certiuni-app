/**
 * Tests unitaires du VerifyService (vérification publique des diplômes).
 *
 * Couvre les 3 statuts attendus : VALIDE, RÉVOKÉ, INTROUVABLE,
 * ainsi que PENDING et FAILED.
 *
 * PrismaService est mocké pour éviter toute connexion base de données.
 */
jest.mock("../../src/common/prisma/prisma.service", () => ({
    PrismaService: jest.fn().mockImplementation(() => ({
        certificate: {
            findUnique: jest.fn(),
        },
    })),
}));

import { CertificateStatus } from '@prisma/client';
import { VerifyService } from '../../src/modules/verify/verify.service';
import { PrismaService } from '../../src/common/prisma/prisma.service';

function makeCertificate(overrides: Record<string, any> = {}) {
    return {
        id: 'cert-1',
        publicIdentifier: 'CERT-123',
        studentFirstName: 'Jean',
        studentLastName: 'Dupont',
        degreeTitle: 'Licence Professionnelle',
        issueDate: new Date('2026-01-15'),
        status: CertificateStatus.ISSUED,
        revocationReason: null,
        university: { name: 'Universite de Test' },
        issuedBy: { name: 'Admin User' },
        ...overrides,
    };
}

describe('VerifyService', () => {
    let service: VerifyService;
    let prisma: jest.Mocked<PrismaService>;

    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaService() as any;
        service = new VerifyService(prisma);
    });

    describe('verifyByHash', () => {
        it('should return VALID for an ISSUED certificate', async () => {
            const cert = makeCertificate({ status: CertificateStatus.ISSUED });
            (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(cert);

            const result = await service.verifyByHash('a'.repeat(64), { ip: '1.2.3.4', userAgent: 'test' });

            expect(prisma.certificate.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ canonicalHash: 'a'.repeat(64) }),
                })
            );
            expect(result.status).toBe('VALIDE');
            expect(result.universityName).toBe('Universite de Test');
            expect(result.issuedBy).toBeDefined();
            expect(result.revocationReason).toBeNull();
        });

        it('should return REVOKED for a REVOKED certificate', async () => {
            const cert = makeCertificate({
                status: CertificateStatus.REVOKED,
                revocationReason: 'Fraud detected',
            });
            (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(cert);

            const result = await service.verifyByHash('a'.repeat(64), { ip: '1.2.3.4', userAgent: 'test' });

            expect(result.status).toBe('RÉVOKÉ');
            expect(result.universityName).toBe('Universite de Test');
            expect(result.revocationReason).toBe('Fraud detected');
        });

        it('should return PENDING for a PENDING certificate', async () => {
            const cert = makeCertificate({ status: CertificateStatus.PENDING });
            (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(cert);

            const result = await service.verifyByHash('a'.repeat(64), { ip: '1.2.3.4', userAgent: 'test' });

            expect(result.status).toBe('PENDING');
        });

        it('should return FAILED for any other status', async () => {
            const cert = makeCertificate({ status: 'FAILED' as CertificateStatus });
            (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(cert);

            const result = await service.verifyByHash('a'.repeat(64), { ip: '1.2.3.4', userAgent: 'test' });

            expect(result.status).toBe('FAILED');
        });

        it('should return INTROUVABLE when no certificate matches', async () => {
            (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await service.verifyByHash('a'.repeat(64), { ip: '1.2.3.4', userAgent: 'test' });

            expect(result.status).toBe('INTROUVABLE');
        });
    });

    describe('verifyByQrData', () => {
        it('should return VALID for an ISSUED certificate from a public identifier', async () => {
            const cert = makeCertificate({ status: CertificateStatus.ISSUED });
            (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(cert);

            const result = await service.verifyByQrData('CERT-123');

            expect(prisma.certificate.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ publicIdentifier: 'CERT-123' }),
                })
            );
            expect(result.status).toBe('VALIDE');
            expect(result.universityName).toBe('Universite de Test');
        });

        it('should return REVOKED for a REVOKED certificate', async () => {
            const cert = makeCertificate({ status: CertificateStatus.REVOKED });
            (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(cert);

            const result = await service.verifyByQrData('CERT-123');

            expect(result.status).toBe('RÉVOKÉ');
            expect(result.universityName).toBe('Universite de Test');
        });

        it('should return INTROUVABLE when no certificate matches', async () => {
            (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await service.verifyByQrData('CERT-999');

            expect(result.status).toBe('INTROUVABLE');
        });

        it('should return INTROUVABLE for invalid QR content', async () => {
            const result = await service.verifyByQrData('invalid/path?query=1');

            expect(result.status).toBe('INTROUVABLE');
        });
    });
});
