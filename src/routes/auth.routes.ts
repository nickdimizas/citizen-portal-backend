import { Router } from 'express';

import {
  registerController,
  loginController,
  logoutController,
} from '../controllers/auth.controller';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../types/authenticated-request';
import { UserRole } from '../models/user.model';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', logoutController);

router.get('/protected', verifyToken, (req: AuthenticatedRequest, res) => {
  return res.json({
    status: true,
    message: 'Access granted to protected route.',
    user: req.user,
  });
});

router.get('/citizen-only', verifyToken, verifyRole(UserRole.Citizen), (req, res) => {
  res.json({
    status: true,
    message: 'Welcome Citizen, access granted!',
  });
});

export default router;
