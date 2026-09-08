import { Router } from 'express';
import { authenticateJwt } from '../middlewares/auth.middleware';
import { getDashboard, getUniversityById, updateUniversity, getAuditLogs } from '../controllers/university.controller.ts';

const router = Router();

router.use(authenticateJwt);

router.get('/dashboard', getDashboard);
router.get('/:id', getUniversityById);
router.patch('/:id', updateUniversity);
router.get('/:id/audit-logs', getAuditLogs);

export default router;
