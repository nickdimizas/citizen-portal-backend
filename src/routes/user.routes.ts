import { Router } from 'express';

import { verifyToken, verifyRole } from '../middlewares/auth.middleware';
import {
  createUserController,
  getUsersController,
  updateUserController,
  getUserController,
  toggleUserActiveController,
  changeUserRoleController,
  changePasswordController,
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
router.patch('/me', verifyToken, updateUserController);
router.patch('/me/password', verifyToken, changePasswordController);

router.get('/:id', verifyToken, verifyRole([UserRole.Admin, UserRole.Employee]), getUserController);
router.patch(
  '/:id',
  verifyToken,
  verifyRole([UserRole.Admin, UserRole.Employee]),
  updateUserController,
);
router.patch('/:id/active', verifyToken, verifyRole([UserRole.Admin]), toggleUserActiveController);
router.patch('/:id/role', verifyToken, verifyRole([UserRole.Admin]), changeUserRoleController);

export default router;
