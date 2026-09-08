import { z } from 'zod';

export const CreateUniversitySchema = z.object({
  name: z.string().min(3, 'Nom université requis'),
  acronym: z.string().min(2, 'Acronyme requis'),
  officialEmailDomain: z.string().email('Domaine email invalide'),
  logoUrl: z.string().url('URL du logo invalide').optional(),
  website: z.string().url('URL du site invalide').optional(),
});

export const UpdateUniversitySchema = CreateUniversitySchema.partial();

export type CreateUniversityDTO = z.infer<typeof CreateUniversitySchema>;
export type UpdateUniversityDTO = z.infer<typeof UpdateUniversitySchema>;
