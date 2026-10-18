import { Router } from 'express';
import { verifyCertificate } from '../../controllers/verify.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { createRateLimiter } from '../../middlewares/rateLimit.middleware';
import { VerifyCertificateQuerySchema } from '../../dtos/certificate.dto';

const router = Router();

// Rate limiting strict pour l'endpoint public (30 requêtes / minute par IP)
const verifyRateLimiter = createRateLimiter({
    windowInSeconds: 60,
    maxRequests: 30,
});

/**
 * GET /api/v1/verify
 * Endpoint public de vérification des diplômes
 * Exemple d'utilisation : /api/v1/verify?identifier=CERT-1724838400-4821
 */
router.get(
    '/',
    verifyRateLimiter,
    validateRequest(VerifyCertificateQuerySchema),
    verifyCertificate
);

export default router;