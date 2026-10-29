import { Router } from 'express';
import { authenticateJwt } from '../../middlewares/auth.middleware';
import {
    createUniversity,
    findAllUniversities,
    getUniversityById,
    updateUniversity,
    getAuditLogs,
} from '../../controllers/university.controller';

const router = Router();

// Middleware d'authentification requis pour toutes les routes université
router.use(authenticateJwt);

// POST /api/v1/universities - Créer une université (SUPER_ADMIN uniquement)
router.post('/', createUniversity);

// GET /api/v1/universities - Lister toutes les universités (SUPER_ADMIN uniquement)
router.get('/', findAllUniversities);

// GET /api/v1/universities/:id - Obtenir une université par ID
router.get('/:id', getUniversityById);

// PATCH /api/v1/universities/:id - Mettre à jour une université (SUPER_ADMIN uniquement)
router.patch('/:id', updateUniversity);

// GET /api/v1/universities/:id/audit-logs - Obtenir les logs d'audit (SUPER_ADMIN uniquement)
router.get('/:id/audit-logs', getAuditLogs);

export default router;
