import { Router } from 'express';
import { authenticateJwt } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { processPayment, getPaymentHistory, getPaymentReceipt } from '../controllers/payment.controller';

const router = Router();

router.use(authenticateJwt);

// Payment routes
router.post('/process', processPayment);
router.get('/history', getPaymentHistory);
router.get('/receipt/:transactionRef', getPaymentReceipt);

export default router;
