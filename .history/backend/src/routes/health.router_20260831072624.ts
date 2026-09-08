import { Router } from 'express';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'certiuni-backend',
    timestamp: new Date().toISOString(),
  });
});

export default router;
