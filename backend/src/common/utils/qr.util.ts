import * as QRCode from 'qrcode';

/**
 * Utilitaires pur d'encodage QR Code.
 */

export async function generateQrDataUrl(text: string): Promise<string> {
    return QRCode.toDataURL(text, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        width: 300,
    });
}

export async function generateQrPngBuffer(text: string): Promise<Buffer> {
    return QRCode.toBuffer(text, {
        errorCorrectionLevel: 'H',
        type: 'png',
        margin: 1,
        width: 300,
    });
}