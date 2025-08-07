import { Router } from 'express';

import { verifyToken, verifyRole } from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model';
import { getUsersController } from '../controllers/user.controller';

const router = Router();

router.get('/users', verifyToken, verifyRole(UserRole.Employee), getUsersController);

export default router;
