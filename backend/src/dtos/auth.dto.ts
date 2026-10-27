import { z } from 'zod';

// Mot de passe fort : min 8 car, 1 majuscule, 1 minuscule, 1 chiffre, 1 car. spécial
const passwordSchema = z
    .string({ required_error: 'Le mot de passe est requis.' })
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule.')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule.')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre.')
    .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial.');

export const LoginSchema = z.object({
    email: z
        .string({ required_error: 'L\'adresse email est requise.' })
        .email('Format d\'adresse email invalide.')
        .toLowerCase()
        .trim(),
    password: z
        .string({ required_error: 'Le mot de passe est requis.' })
        .min(1, 'Le mot de passe ne peut pas être vide.'),
    mfaCode: z
        .string()
        .length(6, 'Le code MFA doit contenir exactement 6 chiffres.')
        .regex(/^\d+$/, 'Le code MFA doit contenir uniquement des chiffres.')
        .optional(),
});

export const RegisterUserSchema = z.object({
    email: z
        .string({ required_error: 'L\'email est requis.' })
        .email('Format d\'email invalide.')
        .toLowerCase()
        .trim(),
    password: passwordSchema,
    firstName: z
        .string({ required_error: 'Le prénom est requis.' })
        .min(2, 'Le prénom doit contenir au moins 2 caractères.')
        .max(50, 'Le prénom ne peut pas dépasser 50 caractères.')
        .trim(),
    lastName: z
        .string({ required_error: 'Le nom est requis.' })
        .min(2, 'Le nom doit contenir au moins 2 caractères.')
        .max(50, 'Le nom ne peut pas dépasser 50 caractères.')
        .trim(),
    role: z.enum(['SUPER_ADMIN', 'UNIV_ADMIN', 'ISSUER', 'VERIFIER'], {
        required_error: 'Le rôle utilisateur est requis.',
    }),
    universityId: z
        .string()
        .uuid('L\'identifiant de l\'université doit être un UUID valide.')
        .optional(),
});

export const RefreshTokenSchema = z.object({
    refreshToken: z
        .string({ required_error: 'Le jeton de rafraîchissement est requis.' })
        .min(1, 'Le jeton de rafraîchissement ne peut pas être vide.'),
});

export const EnableMfaSchema = z.object({
    token: z
        .string({ required_error: 'Le jeton TOTP est requis.' })
        .length(6, 'Le code de vérification doit comporter 6 chiffres.')
        .regex(/^\d+$/, 'Le code doit être numérique.'),
});

// Export des types TypeScript inférés à partir des schémas
export type LoginDTO = z.infer<typeof LoginSchema>;
export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;
export type RefreshTokenDTO = z.infer<typeof RefreshTokenSchema>;
export type EnableMfaDTO = z.infer<typeof EnableMfaSchema>;


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