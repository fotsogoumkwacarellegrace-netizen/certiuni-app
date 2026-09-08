import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = Router();

// Route d'ingestion Batch : Réservée aux ADMIN_UNIV et SUPERADMIN_MINESUP
router.post(
  '/batch/upload',
  authenticateJWT,
  authorizeRoles('ADMIN_UNIV', 'SUPERADMIN_MINESUP'),
  (req, res) => {
    // req.user est typé et garanti d'exister ici
    const universityId = req.user?.universityId;

    res.status(200).json({
      message: 'Fichier reçu et en cours de traitement',
      tenant: universityId,
      processedBy: req.user?.email
    });
  }
);

export default router;

