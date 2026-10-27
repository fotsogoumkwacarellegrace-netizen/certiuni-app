import { createHmac, timingSafeEqual } from 'crypto';
import { ServiceUnavailableException } from '@nestjs/common';
import { env } from '../../config/env.config';

const QR_SIGNATURE_PREFIX = 'certiuni:certificate-qr:v1:';

export function signCertificateQr(identifier: string): string {
    if (!env.QR_SECRET_KEY) {
        throw new ServiceUnavailableException({
            error: 'not_configured',
            feature: 'qr',
        });
    }

    return createHmac('sha256', env.QR_SECRET_KEY)
        .update(`${QR_SIGNATURE_PREFIX}${identifier}`)
        .digest('hex');
}

export function createSignedCertificateVerificationUrl(identifier: string): string {
    if (!env.PUBLIC_VERIFY_URL) {
        throw new ServiceUnavailableException({
            error: 'not_configured',
            feature: 'qr-verification-url',
        });
    }

    return (
        `${env.PUBLIC_VERIFY_URL.replace(/\/+$/, '')}/${encodeURIComponent(identifier)}` +
        `?signature=${signCertificateQr(identifier)}`
    );
}

export function verifyCertificateQrSignature(identifier: string, signature: string): boolean {
    if (!env.QR_SECRET_KEY || !/^[a-f0-9]{64}$/i.test(signature)) {
        return false;
    }

    const expected = Buffer.from(signCertificateQr(identifier), 'hex');
    const provided = Buffer.from(signature, 'hex');
    return expected.length === provided.length && timingSafeEqual(expected, provided);
}
