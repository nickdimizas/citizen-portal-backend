import { Router } from 'express';

import { verifyToken, verifyRole } from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model';
import { getUserByIdController, getUsersController } from '../controllers/user.controller';

const router = Router();

router.get('/users', verifyToken, verifyRole(UserRole.Employee), getUsersController);
router.get('/users/:id', verifyToken, verifyRole(UserRole.Employee), getUserByIdController);

export default router;
