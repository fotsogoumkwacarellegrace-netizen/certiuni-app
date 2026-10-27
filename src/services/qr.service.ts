import QRCode from 'qrcode';

/**
 * Génère un QR Code sous forme d'image Base64 Data URL (image/png)
 */
export const generateQrCodeDataUrl = async (url: string): Promise<string> => {
    return await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
        color: {
            dark: '#0F172A',
            light: '#FFFFFF',
        },
    });
};