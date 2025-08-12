import { Router } from 'express';

import { verifyToken, verifyRole } from '../middlewares/auth.middleware';
import {
  createUserController,
  getUsersController,
  updateUserController,
  getUserController,
} from '../controllers/user.controller';
import { UserRole } from '../models/user.model';

const router = Router();

router.get('/', verifyToken, verifyRole([UserRole.Admin, UserRole.Employee]), getUsersController);
router.post(
  '/',
  verifyToken,
  verifyRole([UserRole.Admin, UserRole.Employee]),
  createUserController,
);

router.get('/me', verifyToken, getUserController);
router.post('/me', verifyToken, updateUserController);

router.get('/:id', verifyToken, verifyRole([UserRole.Admin, UserRole.Employee]), getUserController);
router.post(
  '/:id',
  verifyToken,
  verifyRole([UserRole.Admin, UserRole.Employee]),
  updateUserController,
);

export default router;
