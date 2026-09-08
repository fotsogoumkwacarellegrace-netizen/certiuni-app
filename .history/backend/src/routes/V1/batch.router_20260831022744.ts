import { Router } from 'express';
import { importCertificatesBatch } from '../../controllers/batch.controller';
import { uploadBatchFile } from '../../middlewares/upload.middleware';
import { authenticateJwt } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';

const router = Router();

// Sécurisation de l'accès par token JWT
router.use(authenticateJwt);

/**
 * POST /api/v1/certificates/batch-import
 * Importation en masse de diplômes via fichier CSV ou XLSX
 * Accès réservé aux rôles ISSUER, UNIV_ADMIN et SUPER_ADMIN
 */
router.post(
  '/batch-import',
  authorizeRoles('ISSUER', 'UNIV_ADMIN', 'SUPER_ADMIN'),
  uploadBatchFile,
  importCertificatesBatch
);

export default router;