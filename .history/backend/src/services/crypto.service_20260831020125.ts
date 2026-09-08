import { createHash } from 'crypto';
import canonicalize from 'canonicalize';

export class CryptoService {
  /**
   * Calcule le hash SHA-256 canonique des métadonnées du diplôme
   */
  public static calculateCertificateHash(payload: Record<string, any>): string {
    const canonicalJson = 
    if (!canonicalJson) {
      throw new Error('Échec de la canonicalisation JSON');
    }
    return createHash('sha256').update(canonicalJson, 'utf8').digest('hex');
  }
}