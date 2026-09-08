import { Router } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { asyncHandler } from '../lib/asyncHandler';

/**
 * AuthController NestJS (@Controller('auth')) -> routeur Express.
 * Monte sur `/api/v1/auth` dans `server.ts`.
 */
const authService = new AuthService();
const router = Router();

/**
 * POST /api/v1/auth/login
 * Endpoint de connexion publique.
 */
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as LoginDto;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: "L'email et le mot de passe sont requis.",
        },
      });
    }

    const result = await authService.login({ email, password });
    return res.json({ success: true, data: result });
  }),
);

/**
 * GET /api/v1/auth/me
 * Endpoint protege : necessite un JWT valide (positionne req.user).
 */
router.get('/me', authenticateJWT, (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

export default router;