import { Router } from 'express';
import { deleteUser, getUser, listUsers, updateUser } from '../controllers/userController';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth, requireRole('admin'));
router.get('/', listUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
