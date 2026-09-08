"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyCertificateQuerySchema = exports.RevokeCertificateSchema = exports.IssueCertificateSchema = void 0;
const openapi = require("@nestjs/swagger");
const zod_1 = require("zod");
exports.IssueCertificateSchema = zod_1.z.object({
    studentIdentifier: zod_1.z
        .string({ required_error: 'L\'identifiant étudiant (NIF/Matricule) est requis.' })
        .min(3, 'L\'identifiant étudiant doit comporter au moins 3 caractères.')
        .max(50, 'L\'identifiant étudiant ne peut pas dépasser 50 caractères.')
        .trim(),
    studentFirstName: zod_1.z
        .string({ required_error: 'Le prénom de l\'étudiant est requis.' })
        .min(2, 'Le prénom doit comporter au moins 2 caractères.')
        .max(100)
        .trim(),
    studentLastName: zod_1.z
        .string({ required_error: 'Le nom de l\'étudiant est requis.' })
        .min(2, 'Le nom doit comporter au moins 2 caractères.')
        .max(100)
        .trim(),
    studentEmail: zod_1.z
        .string({ required_error: 'L\'email de l\'étudiant est requis.' })
        .email('Format de l\'email de l\'étudiant invalide.')
        .toLowerCase()
        .trim(),
    degreeTitle: zod_1.z
        .string({ required_error: 'Le intitule du diplôme est requis.' })
        .min(3, 'Le titre du diplôme doit faire au moins 3 caractères.')
        .max(200)
        .trim(),
    fieldOfStudy: zod_1.z
        .string({ required_error: 'Le domaine d\'études/filière est requis.' })
        .min(2, 'La filière doit faire au moins 2 caractères.')
        .max(150)
        .trim(),
    grade: zod_1.z
        .string()
        .max(50, 'La mention ne peut pas dépasser 50 caractères.')
        .optional(),
    issueDate: zod_1.z
        .string({ required_error: 'La date d\'obtention est requise.' })
        .datetime({ message: 'La date d\'obtention doit être au format ISO (ex: YYYY-MM-DDTHH:mm:ss.sssZ).' }),
});
exports.RevokeCertificateSchema = zod_1.z.object({
    reason: zod_1.z
        .string({ required_error: 'Le motif de révocation est obligatoire.' })
        .min(10, 'Le motif de révocation doit comporter au moins 10 caractères pour des raisons d\'audit.')
        .max(500, 'Le motif ne peut pas dépasser 500 caractères.')
        .trim(),
});
exports.VerifyCertificateQuerySchema = zod_1.z.object({
    identifier: zod_1.z
        .string({ required_error: 'Le hash SHA-256 ou l\'identifiant public est requis.' })
        .min(8, 'Identifiant ou Hash trop court.')
        .trim(),
});
//# sourceMappingURL=certificate.dto.js.map