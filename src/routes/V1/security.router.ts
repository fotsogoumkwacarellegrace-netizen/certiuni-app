import { Router } from 'express';
import {
    reportSuspiciousActivity,
    getSuspiciousLogs,
    blockIpAddress,
} from '../../controllers/security.controller';

const router = Router();

// Public endpoint for fraud reporting
router.post('/report', reportSuspiciousActivity);

// Admin endpoints
router.get('/logs', getSuspiciousLogs);
router.post('/block-ip', blockIpAddress);

export default router;
