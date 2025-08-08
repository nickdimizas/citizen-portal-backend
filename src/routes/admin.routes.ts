import { Router } from 'express';

import { createUserByAdminController } from '../controllers/admin.controller';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model';
import { getUserByIdController, getUsersController } from '../controllers/user.controller';

const router = Router();

router.post('/create-user', verifyToken, verifyRole(UserRole.Admin), createUserByAdminController);
router.get('/users', verifyToken, verifyRole(UserRole.Admin), getUsersController);
router.get('/users/:id', verifyToken, verifyRole(UserRole.Admin), getUserByIdController);

export default router;
