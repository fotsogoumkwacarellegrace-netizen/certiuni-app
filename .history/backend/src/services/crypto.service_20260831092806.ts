import { createHash } from 'crypto';
import crypto from 'crypto';

export interface CanonicalCertificateInput {
  studentIdentifier: string;
  degreeTitle: string;
  issueDate: string | Date;
  universityId: string;
}

export class CryptoService {
  /**
   * Calcule le hash SHA-256 canonique des métadonnées du diplôme
   */
  public static calculateCanonicalHash(payload: {
    studentIdentifier: string;
    degreeTitle: string;
    issueDate: string;
    universityId: string;
  }): string {
    const canonicalJson = `${payload.universityId.toLowerCase()}:${payload.studentIdentifier.trim().toLowerCase()}:${payload.degreeTitle.trim()}:${payload.issueDate}`;
    if (!canonicalJson) {
      throw new Error('Échec de la canonicalisation JSON');
    }
    return createHash('sha256').update(canonicalJson, 'utf8').digest('hex');
  }

  /**
   * Calcule le hash SHA-256 direct d'un Buffer (ex: le fichier PDF final)
   */
  public static calculateBufferHash(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Vérifie l'intégrité d'un diplôme en recalculant son hash canonique
   */
  public static verifyHash(data: CanonicalCertificateInput, expectedHash: string): boolean {
    const computedHash = this.calculateCanonicalHash({
      studentIdentifier: data.studentIdentifier,
      degreeTitle: data.degreeTitle,
      issueDate: typeof data.issueDate === 'string' ? data.issueDate : data.issueDate.toISOString(),
      universityId: data.universityId,
    });

    const computedBuffer = Buffer.from(computedHash, 'hex');
    const expectedBuffer = Buffer.from(expectedHash, 'hex');

    if (computedBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(computedBuffer, expectedBuffer);
  }
}