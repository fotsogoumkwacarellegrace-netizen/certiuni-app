import { Test, TestingModule } from '@nestjs/testing';
import { PdfService } from './pdf.service';
import { S3Service } from '../storage/s3.service';
import * as puppeteer from 'puppeteer';

// Mock de Puppeteer
jest.mock('puppeteer', () => ({
    launch: jest.fn(),
}));

describe('PdfService', () => {
    let service: PdfService;
    let s3ServiceMock: jest.Mocked<S3Service>;

    const mockBrowser = {
        newPage: jest.fn(),
        close: jest.fn(),
    };

    const mockPage = {
        setContent: jest.fn(),
        pdf: jest.fn(),
        close: jest.fn(),
    };

    const sampleCertificateData = {
        documentNumber: 'CERT-2026-X99',
        studentFirstName: 'Jeanne',
        studentLastName: 'Minkoue',
        degreeTitle: 'Master en Génie Logiciel',
        speciality: 'Sécurité Informatique',
        issueDate: '2026-07-15',
        qrCodeUrl: 'https://verify.certiuni.cm/CERT-2026-X99',
        universityName: 'Université de Yaoundé I',
    };

    beforeEach(async () => {
        // Réinitialisation des mocks Puppeteer
        (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);
        mockBrowser.newPage.mockResolvedValue(mockPage);
        mockPage.pdf.mockResolvedValue(Buffer.from('%PDF-1.4 mock pdf content'));

        // Mock du service S3
        const mockS3Provider = {
            uploadFile: jest.fn().mockResolvedValue({
                url: 'https://s3.amazonaws.com/certiuni-bucket/certificates/CERT-2026-X99.pdf',
                key: 'certificates/CERT-2026-X99.pdf',
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PdfService,
                {
                    provide: S3Service,
                    useValue: mockS3Provider,
                },
            ],
        }).compile();

        service = module.get<PdfService>(PdfService);
        s3ServiceMock = module.get(S3Service);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateCertificatePdf', () => {
        it('devrait compiler le template HTML et retourner un Buffer PDF', async () => {
            const pdfBuffer = await service.generateCertificatePdf(sampleCertificateData);

            expect(puppeteer.launch).toHaveBeenCalledTimes(1);
            expect(mockBrowser.newPage).toHaveBeenCalledTimes(1);
            expect(mockPage.setContent).toHaveBeenCalledWith(
                expect.stringContaining(sampleCertificateData.studentFirstName),
                { waitUntil: 'networkidle0' },
            );
            expect(mockPage.pdf).toHaveBeenCalledWith(
                expect.objectContaining({
                    format: 'A4',
                    printBackground: true,
                }),
            );
            expect(mockBrowser.close).toHaveBeenCalledTimes(1);
            expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
        });

        it('devrait fermer le navigateur Puppeteer même en cas d\'erreur lors de la génération', async () => {
            mockPage.pdf.mockRejectedValueOnce(new Error('Erreur de rendu Puppeteer'));

            await expect(
                service.generateCertificatePdf(sampleCertificateData),
            ).rejects.toThrow('Erreur de rendu Puppeteer');

            expect(mockBrowser.close).toHaveBeenCalledTimes(1);
        });
    });

    describe('generateAndUploadCertificate', () => {
        it('devrait générer le PDF et le verser directement sur S3', async () => {
            const result = await service.generateAndUploadCertificate(sampleCertificateData);

            expect(s3ServiceMock.uploadFile).toHaveBeenCalledWith(
                expect.any(Buffer),
                `certificates/${sampleCertificateData.documentNumber}.pdf`,
                'application/pdf',
            );

            expect(result).toEqual({
                fileUrl: 'https://s3.amazonaws.com/certiuni-bucket/certificates/CERT-2026-X99.pdf',
                fileKey: 'certificates/CERT-2026-X99.pdf',
            });
        });

        it('devrait lever une exception si le versement vers S3 échoue', async () => {
            s3ServiceMock.uploadFile.mockRejectedValueOnce(new Error('Échec d\'accès AWS S3'));

            await expect(
                service.generateAndUploadCertificate(sampleCertificateData),
            ).rejects.toThrow('Échec d\'accès AWS S3');
        });
    });
});