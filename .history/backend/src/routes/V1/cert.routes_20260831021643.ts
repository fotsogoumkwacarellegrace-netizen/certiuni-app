import { Router } from 'express';
import {
  issueCertificate,
  getCertificateById,
  revokeCertificate,
} from '../../controllers/cert.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authenticateJwt } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import {
  IssueCertificateSchema,
  RevokeCertificateSchema,
} from '../../dtos/certificate.dto';

const router = Router();

// Toutes les routes relatives aux diplômes requièrent un token JWT valide
router.use(authenticateJwt);

/**
 * POST /api/v1/certificates
 * Émettre un diplôme (Réservé aux ISSUER, UNIV_ADMIN et SUPER_ADMIN)
 */
router.post(
  '/',
  authorizeRoles('ISSUER', 'UNIV_ADMIN', 'SUPER_ADMIN'),
  validateRequest(IssueCertificateSchema),
  issueCertificate
);

/**
 * GET /api/v1/certificates/:id
 * Obtenir les détails d'un diplôme par son ID interne
 */
router.get(
  '/:id',
  authorizeRoles('ISSUER', 'UNIV_ADMIN', 'SUPER_ADMIN', 'VERIFIER'),
  getCertificateById
);

/**
 * POST /api/v1/certificates/:id/revoke
 * Révoquer un diplôme émis (Réservé aux UNIV_ADMIN et SUPER_ADMIN)
 */
router.post(
  '/:id/revoke',
  authorizeRoles('UNIV_ADMIN', 'SUPER_ADMIN'),
  validateRequest(RevokeCertificateSchema),
  revokeCertificate
);

export default router;