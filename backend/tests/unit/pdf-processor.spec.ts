/**
 * Unit tests for PdfProcessor (PDF generation + S3 upload + DB update).
 *
 * External dependencies (Puppeteer, S3/MinIO, QR, Redis/BullMQ) are mocked
 * to validate orchestration logic without infrastructure.
 */
jest.mock('../../src/jobs/queues/pdf.queue', () => ({
    PDF_QUEUE_NAME: 'pdf-test-queue',
}));

jest.mock('../../src/services/pdf.service', () => ({
    generateCertificatePdf: jest.fn(),
}));

jest.mock('../../src/services/storage.service', () => ({
    uploadCertificatePdfToS3: jest.fn(),
}));

jest.mock('../../src/services/qr.service', () => ({
    generateQrCodeDataUrl: jest.fn(),
}));

import { PdfProcessor } from '../../src/jobs/processors/pdf.processor';
import { generateCertificatePdf } from '../../src/services/pdf.service';
import { uploadCertificatePdfToS3 } from '../../src/services/storage.service';
import { generateQrCodeDataUrl } from '../../src/services/qr.service';

const mockedGenerateCertificatePdf = generateCertificatePdf as jest.Mock;
const mockedUpload = uploadCertificatePdfToS3 as jest.Mock;
const mockedQr = generateQrCodeDataUrl as jest.Mock;

function buildPrismaMock() {
    return {
        certificate: {
            update: jest.fn(),
        },
    } as any;
}

function buildJob(overrides: Record<string, any> = {}) {
    return {
        id: 'job-1',
        data: {
            certificateId: 'cert-1',
            publicIdentifier: 'CERT-123',
            studentName: 'Jean Dupont',
            degreeTitle: 'Licence Professionnelle',
            fieldOfStudy: 'Informatique',
            grade: '14/20',
            issueDate: '2026-01-15',
            universityName: 'Universite de Test',
            universityLogoUrl: null,
            canonicalHash: 'canonical-hash-123',
            verificationUrl: 'https://verify.example.com/CERT-123',
            universityId: 'uni-1',
            ...overrides.data,
        },
        attemptsMade: 0,
        opts: { attempts: 3 },
        ...overrides,
    } as any;
}

describe('PdfProcessor', () => {
    let processor: PdfProcessor;
    let prisma: ReturnType<typeof buildPrismaMock>;

    beforeEach(() => {
        jest.clearAllMocks();
        prisma = buildPrismaMock();
        processor = new PdfProcessor(prisma);
    });
    it('should generate PDF, upload to S3 and mark certificate ISSUED', async () => {
        const pdfBuffer = Buffer.from('fake-pdf-content');
        const qrDataUrl = 'data:image/png;base64,abc123';
        const fileUrl = 'https://bucket.s3.eu-west-1.amazonaws.com/certificates/CERT-123.pdf';
        const fileKey = 'certificates/CERT-123.pdf';

        mockedQr.mockResolvedValue(qrDataUrl);
        mockedGenerateCertificatePdf.mockResolvedValue(pdfBuffer);
        mockedUpload.mockResolvedValue({ fileKey, fileUrl });

        const updateMock = prisma.certificate.update as jest.Mock;
        updateMock.mockResolvedValue({
            id: 'cert-1',
            publicIdentifier: 'CERT-123',
            pdfUrl: fileUrl,
            pdfKey: fileKey,
            status: 'ISSUED',
        });

        const job = buildJob();

        const result = await processor.process(job);

        expect(mockedQr).toHaveBeenCalledTimes(1);
        expect(mockedQr).toHaveBeenCalledWith('https://verify.example.com/CERT-123');

        expect(mockedGenerateCertificatePdf).toHaveBeenCalledTimes(1);
        expect(mockedGenerateCertificatePdf).toHaveBeenCalledWith(
            expect.objectContaining({
                publicIdentifier: 'CERT-123',
                studentName: 'Jean Dupont',
                degreeTitle: 'Licence Professionnelle',
                fieldOfStudy: 'Informatique',
                grade: '14/20',
                issueDate: '2026-01-15',
                universityName: 'Universite de Test',
                universityLogoUrl: null,
                canonicalHash: 'canonical-hash-123',
                qrCodeDataUrl: qrDataUrl,
            }),
        );

        expect(mockedUpload).toHaveBeenCalledTimes(1);
        expect(mockedUpload).toHaveBeenCalledWith(pdfBuffer, 'CERT-123');

        expect(updateMock).toHaveBeenCalledTimes(1);
        expect(updateMock).toHaveBeenCalledWith({
            where: { id: 'cert-1' },
            data: { pdfUrl: fileUrl, pdfKey: fileKey, status: 'ISSUED' },
        });

        expect(result).toMatchObject({
            success: true,
            certificateId: 'cert-1',
            publicIdentifier: 'CERT-123',
            pdfUrl: fileUrl,
            pdfKey: fileKey,
            status: 'ISSUED',
        });
    });

    it('should mark certificate FAILED when attempts are exhausted', async () => {
        mockedQr.mockRejectedValue(new Error('QR generation failed'));
        const updateMock = prisma.certificate.update as jest.Mock;
        updateMock.mockResolvedValue({ id: 'cert-1', status: 'FAILED' });

        const job = buildJob({
            attemptsMade: 2,
            data: { certificateId: 'cert-1', publicIdentifier: 'CERT-999' },
        });

        await expect(processor.process(job)).rejects.toThrow('QR generation failed');
        expect(updateMock).toHaveBeenCalledWith({
            where: { id: 'cert-1' },
            data: { status: 'FAILED' },
        });
    });

    it('should NOT mark FAILED when attempts remain', async () => {
        mockedQr.mockRejectedValue(new Error('QR generation failed'));
        const updateMock = prisma.certificate.update as jest.Mock;

        const job = buildJob({ attemptsMade: 0 });
        await expect(processor.process(job)).rejects.toThrow();
        expect(updateMock).not.toHaveBeenCalled();
    });
});