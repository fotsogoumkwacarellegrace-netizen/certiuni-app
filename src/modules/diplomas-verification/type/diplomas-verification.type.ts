import { ExtractedDiplomaSchema } from '@modules/diplomas-verification/type/schema';
import { z } from 'zod';

export type ExtractedDiploma = z.infer<typeof ExtractedDiplomaSchema>;

export type FieldResult = 'MATCH' | 'MISMATCH' | 'UNREADABLE';
export type FieldChecks = Partial<Record<keyof ExtractedDiploma, FieldResult>>;

export type VerificationStatus =
  | 'MATCH' // données cohérentes avec la BD
  | 'MISMATCH' // au moins un champ contredit la BD
  | 'REVOKED' // document trouvé mais révoqué
  | 'NOT_FOUND' // numéro lu dans le QR absent de la BD (ou document non émis)
  | 'QR_NOT_FOUND' // aucun QR lisible sur la photo
  | 'QR_INVALID' // QR lu mais ce n'est pas un numéro CertiUni
  | 'INCONCLUSIVE'; // texte trop illisible pour conclure
