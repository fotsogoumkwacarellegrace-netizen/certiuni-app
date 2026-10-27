import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/common/prisma/prisma.service';
import {
    signCertificateQr,
    verifyCertificateQrSignature,
} from '../../src/common/utils/qr-signature.util';
import { VerificationService } from '../../src/modules/verification/verification.service';

describe('certificate QR signatures', () => {
    it('signs identifiers and rejects modified values', () => {
        const signature = signCertificateQr('CERT-1');

        expect(verifyCertificateQrSignature('CERT-1', signature)).toBe(true);
        expect(verifyCertificateQrSignature('CERT-2', signature)).toBe(false);
        expect(verifyCertificateQrSignature('CERT-1', 'invalid')).toBe(false);
    });

    describe('public QR verification', () => {
        let module: TestingModule;
        let service: VerificationService;
        let certificateFindUnique: jest.Mock;

        beforeEach(async () => {
            certificateFindUnique = jest.fn().mockResolvedValue({
                publicIdentifier: 'CERT-1',
                canonicalHash: 'a'.repeat(64),
                studentFirstName: 'Test',
                studentLastName: 'Student',
                studentIdentifier: 'S-1',
                degreeTitle: 'Degree',
                grade: null,
                issueDate: new Date('2026-01-01T00:00:00.000Z'),
                status: 'ISSUED',
                revokedAt: null,
                revocationReason: null,
                university: { name: 'University', code: 'UNI' },
            });
            const prisma = {
                certificate: {
                    findUnique: certificateFindUnique,
                },
            };
            module = await Test.createTestingModule({
                providers: [
                    VerificationService,
                    { provide: PrismaService, useValue: prisma },
                ],
            }).compile();
            service = module.get(VerificationService);
        });

        afterEach(async () => {
            await module.close();
        });

        it('verifies a signed QR URL against the certificate identifier', async () => {
            const signature = signCertificateQr('CERT-1');
            const result = await service.verifyQr({
                qrData: `https://certiuni.test/verify/CERT-1?signature=${signature}`,
            });

            expect(certificateFindUnique).toHaveBeenCalledWith({
                where: { publicIdentifier: 'CERT-1' },
                select: expect.any(Object),
            });
            expect(result.isValid).toBe(true);
        });

        it('rejects a URL with a missing or invalid signature', async () => {
            await expect(service.verifyQr({
                qrData: 'https://certiuni.test/verify/CERT-1?signature=invalid',
            })).rejects.toBeInstanceOf(BadRequestException);

            expect(certificateFindUnique).not.toHaveBeenCalled();
        });
    });
});
