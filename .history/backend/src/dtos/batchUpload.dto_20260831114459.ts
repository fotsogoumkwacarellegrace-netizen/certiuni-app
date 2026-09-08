import { z } from 'zod';

export const BatchUploadSchema = z.object({
  universityId: z.string().uuid('ID université invalide'),
  fileName: z.string(),
});

export type BatchUploadDTO = z.infer<typeof BatchUploadSchema>;
