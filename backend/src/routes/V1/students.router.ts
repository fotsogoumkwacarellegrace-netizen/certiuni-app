import { Router } from 'express';
import { authenticateJwt } from '../../middlewares/auth.middleware';
import {
    findAll,
    findOne,
    create,
    update,
    remove,
} from '../../controllers/students.controller';

const router = Router();

// Middleware d'authentification requis pour toutes les routes étudiant
router.use(authenticateJwt);

// GET /api/v1/students - Lister tous les étudiants (SUPER_ADMIN ou UNIV_ADMIN)
router.get('/', findAll);

// GET /api/v1/students/:id - Obtenir un étudiant par ID
router.get('/:id', findOne);

// POST /api/v1/students - Créer un nouvel étudiant (SUPER_ADMIN uniquement)
router.post('/', create);

// PATCH /api/v1/students/:id - Mettre à jour un étudiant (SUPER_ADMIN ou UNIV_ADMIN)
router.patch('/:id', update);

// DELETE /api/v1/students/:id - Supprimer un étudiant (SUPER_ADMIN uniquement)
router.delete('/:id', remove);

export default router;