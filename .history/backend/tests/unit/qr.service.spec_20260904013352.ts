import { Test, TestingModule } from '@nestjs/testing';
import { QrService } from './qr.service';
import * as QRCode from 'qrcode';

// Mock de la bibliothèque 'qrcode'
jest.mock('qrcode', () => ({
    toDataURL: jest.fn(),
    toBuffer: jest.fn(),
}));

describe('QrService', () => {
    let service: QrService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [QrService],
        }).compile();

        service = module.get<QrService>(QrService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateDataUrl', () => {
        it('devrait générer une Data URL au format base64 PNG', async () => {
            const targetUrl = 'https://verify.certiuni.cm/CERT-2026-X99';
            const mockDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';

            (QRCode.toDataURL as jest.Mock).mockResolvedValue(mockDataUrl);

            const result = await service.generateDataUrl(targetUrl);

            expect(QRCode.toDataURL).toHaveBeenCalledWith(
                targetUrl,
                expect.objectContaining({
                    errorCorrectionLevel: 'H',
                    type: 'image/png',
                    margin: 1,
                }),
            );
            expect(result).toBe(mockDataUrl);
            expect(result).toMatch(/^data:image\/png;base64,/);
        });

        it('devrait lever une erreur si la génération de la Data URL échoue', async () => {
            (QRCode.toDataURL as jest.Mock).mockRejectedValue(
                new Error('Erreur d\'encodage du QR Code'),
            );

            await expect(
                service.generateDataUrl('https://verify.certiuni.cm/invalid'),
            ).rejects.toThrow('Erreur d\'encodage du QR Code');
        });
    });

    describe('generatePngBuffer', () => {
        it('devrait générer un Buffer PNG contenant le QR code', async () => {
            const targetUrl = 'https://verify.certiuni.cm/CERT-2026-X99';
            const mockBuffer = Buffer.from('mock-png-qr-code-bytes');

            (QRCode.toBuffer as jest.Mock).mockResolvedValue(mockBuffer);

            const result = await service.generatePngBuffer(targetUrl);

            expect(QRCode.toBuffer).toHaveBeenCalledWith(
                targetUrl,
                expect.objectContaining({
                    errorCorrectionLevel: 'H',
                    type: 'png',
                }),
            );
            expect(Buffer.isBuffer(result)).toBe(true);
            expect(result).toEqual(mockBuffer);
        });

        it('devrait lever une erreur si la génération du Buffer PNG échoue', async () => {
            (QRCode.toBuffer as jest.Mock).mockRejectedValue(
                new Error('Échec de la conversion en Buffer PNG'),
            );

            await expect(
                service.generatePngBuffer('https://verify.certiuni.cm/error'),
            ).rejects.toThrow('Échec de la conversion en Buffer PNG');
        });
    });
});