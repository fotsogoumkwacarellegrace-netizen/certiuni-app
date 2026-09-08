import { createHash } from 'crypto';
import canonicalize from 'canonicalize';

import crypto from 'crypto';

export interface CanonicalCertificateInput {
  studentIdentifier: string;
  degreeTitle: string;
  issueDate: string | Date;
  universityId: string;
}
export class CryptoService {
  /**
   * Normalise les données d'entrée pour garantir un comportement déterministe
   */
  private static canonicalize(data: CanonicalCertificateInput): string {
    const cleanStudentId = data.studentIdentifier.trim().toUpperCase();
    const cleanDegreeTitle = data.degreeTitle.trim().toLowerCase().replace(/\s+/g, ' ');
    const cleanUniversityId = data.universityId.trim().toLowerCase();

    // Normalisation de la date au format ISO strict YYYY-MM-DD
    const dateObj = typeof data.issueDate === 'string' ? new Date(data.issueDate) : data.issueDate;
    const cleanDate = dateObj.toISOString().split('T')[0];

    // Chaîne canonique ordonnée avec séparateur strict
    return `univ:${cleanUniversityId}|id:${cleanStudentId}|degree:${cleanDegreeTitle}|date:${cleanDate}`;
  }
  
  /**
   * Calcule le hash SHA-256 canonique des métadonnées du diplôme
   */
  public static calculateCertificateHash(payload: {
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
}