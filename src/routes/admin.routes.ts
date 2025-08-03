import { Router } from 'express';

import { createUserByAdminController } from '../controllers/admin.controller';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware';
import { UserRole } from '../models/user.model';

const router = Router();

router.post('/create-user', verifyToken, verifyRole(UserRole.Admin), createUserByAdminController);

export default router;
