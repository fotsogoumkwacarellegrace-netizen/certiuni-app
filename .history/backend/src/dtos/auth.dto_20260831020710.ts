// import { z } from 'zod';

// /**
//  * Validation de la connexion utilisateur
//  */
// export const LoginSchema = z.object({
//     email: z
//         .string({ required_error: 'L\'adresse email est requise.' })
//         .email('Adresse email invalide.')
//         .trim()
//         .toLowerCase(),
//     password: z
//         .string({ required_error: 'Le mot de passe est requis.' })
//         .min(1, 'Le mot de passe ne peut pas être vide.'),
//     mfaCode: z
//         .string()
//         .length(6, 'Le code TOTP doit contenir exactement 6 chiffres.')
//         .regex(/^\d+$/, 'Le code TOTP doit contenir uniquement des chiffres.')
//         .optional(),
// });

// /**
//  * Validation du renouvellement de jeton JWT
//  */
// export const RefreshTokenSchema = z.object({
//     refreshToken: z
//         .string({ required_error: 'Le jeton de rafraîchissement est requis.' })
//         .min(1, 'Le jeton ne peut pas être vide.'),
// });

// /**
//  * Validation de l'activation du Double Facteur (MFA)
//  */
// export const EnableMfaSchema = z.object({
//     totpCode: z
//         .string({ required_error: 'Le code de vérification TOTP est requis.' })
//         .length(6, 'Le code TOTP doit être composé de 6 chiffres.')
//         .regex(/^\d+$/, 'Le code TOTP doit contenir uniquement des chiffres.'),
// });

// // Inférence des types TypeScript
// export type LoginDTO = z.infer<typeof LoginSchema>;
// export type RefreshTokenDTO = z.infer<typeof RefreshTokenSchema>;
// export type EnableMfaDTO = z.infer<typeof EnableMfaSchema>;