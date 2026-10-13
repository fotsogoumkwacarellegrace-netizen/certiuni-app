import { z } from 'zod';

export const IssueCertificateSchema = z.object({
    studentIdentifier: z
        .string({ required_error: 'L\'identifiant étudiant (NIF/Matricule) est requis.' })
        .min(3, 'L\'identifiant étudiant doit comporter au moins 3 caractères.')
        .max(50, 'L\'identifiant étudiant ne peut pas dépasser 50 caractères.')
        .trim(),
    studentFirstName: z
        .string({ required_error: 'Le prénom de l\'étudiant est requis.' })
        .min(2, 'Le prénom doit comporter au moins 2 caractères.')
        .max(100)
        .trim(),
    studentLastName: z
        .string({ required_error: 'Le nom de l\'étudiant est requis.' })
        .min(2, 'Le nom doit comporter au moins 2 caractères.')
        .max(100)
        .trim(),
    studentEmail: z
        .string({ required_error: 'L\'email de l\'étudiant est requis.' })
        .email('Format de l\'email de l\'étudiant invalide.')
        .toLowerCase()
        .trim(),
    degreeTitle: z
        .string({ required_error: 'Le intitule du diplôme est requis.' })
        .min(3, 'Le titre du diplôme doit faire au moins 3 caractères.')
        .max(200)
        .trim(),
    fieldOfStudy: z
        .string({ required_error: 'Le domaine d\'études/filière est requis.' })
        .min(2, 'La filière doit faire au moins 2 caractères.')
        .max(150)
        .trim(),
    grade: z
        .string()
        .max(50, 'La mention ne peut pas dépasser 50 caractères.')
        .optional(),
    issueDate: z
        .string({ required_error: 'La date d\'obtention est requise.' })
        .datetime({ message: 'La date d\'obtention doit être au format ISO (ex: YYYY-MM-DDTHH:mm:ss.sssZ).' }),
});

export const RevokeCertificateSchema = z.object({
    reason: z
        .string({ required_error: 'Le motif de révocation est obligatoire.' })
        .min(10, 'Le motif de révocation doit comporter au moins 10 caractères pour des raisons d\'audit.')
        .max(500, 'Le motif ne peut pas dépasser 500 caractères.')
        .trim(),
});

export const VerifyCertificateQuerySchema = z.object({
    identifier: z
        .string({ required_error: 'Le hash SHA-256 ou l\'identifiant public est requis.' })
        .min(8, 'Identifiant ou Hash trop court.')
        .trim(),
});

// Export des types TypeScript inférés
export type IssueCertificateDTO = z.infer<typeof IssueCertificateSchema>;
export type RevokeCertificateDTO = z.infer<typeof RevokeCertificateSchema>;
export type VerifyCertificateQueryDTO = z.infer<typeof VerifyCertificateQuerySchema>;



// import { z } from 'zod';

// /**
//  * Validation de l'émission d'un diplôme (unitaire ou par ligne de lot)
//  */
// export const IssueCertificateSchema = z.object({
//     studentIdentifier: z
//         .string({ required_error: 'Le matricule étudiant est requis.' })
//         .min(2, 'Le matricule doit contenir au moins 2 caractères.')
//         .max(50, 'Le matricule ne peut pas dépasser 50 caractères.')
//         .trim(),
//     studentFirstName: z
//         .string({ required_error: 'Le prénom de l\'étudiant est requis.' })
//         .min(2, 'Le prénom doit contenir au moins 2 caractères.')
//         .max(100, 'Le prénom ne peut pas dépasser 100 caractères.')
//         .trim(),
//     studentLastName: z
//         .string({ required_error: 'Le nom de l\'étudiant est requis.' })
//         .min(2, 'Le nom doit contenir au moins 2 caractères.')
//         .max(100, 'Le nom ne peut pas dépasser 100 caractères.')
//         .trim(),
//     studentEmail: z
//         .string({ required_error: 'L\'email de l\'étudiant est requis.' })
//         .email('Adresse email de l\'étudiant invalide.')
//         .trim()
//         .toLowerCase(),
//     degreeTitle: z
//         .string({ required_error: 'Le titre du diplôme est requis.' })
//         .min(3, 'Le intitulé du diplôme doit contenir au moins 3 caractères.')
//         .max(255, 'L\'intitulé ne peut pas dépasser 255 caractères.')
//         .trim(),
//     fieldOfStudy: z
//         .string({ required_error: 'La filière d\'étude est requise.' })
//         .min(2, 'La filière d\'étude doit contenir au moins 2 caractères.')
//         .max(200, 'La filière ne peut pas dépasser 200 caractères.')
//         .trim(),
//     grade: z
//         .string()
//         .max(50, 'La mention ne peut pas dépasser 50 caractères.')
//         .trim()
//         .optional(),
//     issueDate: z
//         .string({ required_error: 'La date d\'obtention est requise.' })
//         .refine((val) => !isNaN(Date.parse(val)), {
//             message: 'La date d\'obtention doit être au format ISO valide (ex: YYYY-MM-DD).',
//         }),
// });

// /**
//  * Validation de la révocation d'un diplôme
//  */
// export const RevokeCertificateSchema = z.object({
//     reason: z
//         .string({ required_error: 'Le motif de révocation est requis.' })
//         .min(10, 'Le motif doit contenir au moins 10 caractères pour des raisons d\'audit.')
//         .max(1000, 'Le motif ne peut pas dépasser 1000 caractères.')
//         .trim(),
// });

// // Inférence des types TypeScript
// export type IssueCertificateDTO = z.infer<typeof IssueCertificateSchema>;
// export type RevokeCertificateDTO = z.infer<typeof RevokeCertificateSchema>;