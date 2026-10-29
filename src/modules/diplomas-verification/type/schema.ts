import { z } from 'zod';
import { ExtractedDiploma, FieldChecks, VerificationStatus } from '@modules/diplomas-verification/type/diplomas-verification.type';

export const nullableText = z
  .string()
  .trim()
  .nullish()
  .transform((v) => v || null);

export const ExtractedDiplomaSchema = z.object({
  firstName: nullableText,
  lastName: nullableText,
  degreeTitle: nullableText,
  fieldOfStudy: nullableText,
  university: nullableText,
  issueDate: nullableText, // attendu au format YYYY-MM-DD
  certificateNumber: nullableText,
});

export interface ImageVerificationResult {
  extracted: ExtractedDiploma;
  qr: { found: boolean; certificateNumber: string | null };
  verification: {
    status: VerificationStatus;
    /** true = identique à la BD, false = différent, null = impossible à dire */
    isMatch: boolean | null;
    /** Résultat champ par champ (sans jamais renvoyer les valeurs de la BD) */
    fields: FieldChecks | null;
  };
}

export interface RequestMeta {
  ipAddress?: string;
  userAgent?: string;
}
