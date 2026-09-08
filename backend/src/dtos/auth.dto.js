"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnableMfaSchema = exports.RefreshTokenSchema = exports.RegisterUserSchema = exports.LoginSchema = void 0;
const openapi = require("@nestjs/swagger");
const zod_1 = require("zod");
const passwordSchema = zod_1.z
    .string({ required_error: 'Le mot de passe est requis.' })
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule.')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule.')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre.')
    .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial.');
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'L\'adresse email est requise.' })
        .email('Format d\'adresse email invalide.')
        .toLowerCase()
        .trim(),
    password: zod_1.z
        .string({ required_error: 'Le mot de passe est requis.' })
        .min(1, 'Le mot de passe ne peut pas être vide.'),
    mfaCode: zod_1.z
        .string()
        .length(6, 'Le code MFA doit contenir exactement 6 chiffres.')
        .regex(/^\d+$/, 'Le code MFA doit contenir uniquement des chiffres.')
        .optional(),
});
exports.RegisterUserSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'L\'email est requis.' })
        .email('Format d\'email invalide.')
        .toLowerCase()
        .trim(),
    password: passwordSchema,
    firstName: zod_1.z
        .string({ required_error: 'Le prénom est requis.' })
        .min(2, 'Le prénom doit contenir au moins 2 caractères.')
        .max(50, 'Le prénom ne peut pas dépasser 50 caractères.')
        .trim(),
    lastName: zod_1.z
        .string({ required_error: 'Le nom est requis.' })
        .min(2, 'Le nom doit contenir au moins 2 caractères.')
        .max(50, 'Le nom ne peut pas dépasser 50 caractères.')
        .trim(),
    role: zod_1.z.enum(['SUPER_ADMIN', 'UNIV_ADMIN', 'ISSUER', 'VERIFIER'], {
        required_error: 'Le rôle utilisateur est requis.',
    }),
    universityId: zod_1.z
        .string()
        .uuid('L\'identifiant de l\'université doit être un UUID valide.')
        .optional(),
});
exports.RefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z
        .string({ required_error: 'Le jeton de rafraîchissement est requis.' })
        .min(1, 'Le jeton de rafraîchissement ne peut pas être vide.'),
});
exports.EnableMfaSchema = zod_1.z.object({
    token: zod_1.z
        .string({ required_error: 'Le jeton TOTP est requis.' })
        .length(6, 'Le code de vérification doit comporter 6 chiffres.')
        .regex(/^\d+$/, 'Le code doit être numérique.'),
});
//# sourceMappingURL=auth.dto.js.map