import { Router } from 'express';

import { verifyToken, verifyRole } from '../middlewares/auth.middleware';
import { createUserByAdminController } from '../controllers/admin.controller';
import {
  getUsersController,
  getUserByIdController,
  getUserProfileController,
} from '../controllers/user.controller';
import { UserRole } from '../models/user.model';

const router = Router();

router.post(
  '/',
  verifyToken,
  verifyRole([UserRole.Admin, UserRole.Employee]),
  createUserByAdminController,
);
router.get('/', verifyToken, verifyRole([UserRole.Admin, UserRole.Employee]), getUsersController);
router.get('/me', verifyToken, getUserProfileController);
router.get(
  '/:id',
  verifyToken,
  verifyRole([UserRole.Admin, UserRole.Employee]),
  getUserByIdController,
);

export default router;
