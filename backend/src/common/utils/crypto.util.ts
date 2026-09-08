import * as crypto from 'crypto';

/**
 * Fonctions pures pour les opérations cryptographiques de base.
 */

export function generateSha256(data: string | object | Buffer): string {
    const content = typeof data === 'object' && !Buffer.isBuffer(data)
        ? JSON.stringify(data)
        : data;

    return crypto.createHash('sha256').update(content).digest('hex');
}

export function generateHmacSha256(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function generateRandomSalt(length = 32): string {
    return crypto.randomBytes(length).toString('hex');
}

export function verifySha256(data: string | object | Buffer, expectedHash: string): boolean {
    const actualHash = generateSha256(data);
    return crypto.timingSafeEqual(
        Buffer.from(actualHash, 'hex'),
        Buffer.from(expectedHash, 'hex'),
    );
}