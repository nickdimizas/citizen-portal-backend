import { Router } from 'express';

import { register, loginController } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../types/authenticated-request';

const router = Router();

router.post('/register', register);
router.post('/login', loginController);

router.get('/protected', verifyToken, (req: AuthenticatedRequest, res) => {
  return res.json({
    status: true,
    message: 'Access granted to protected route.',
    user: req.user,
  });
});

export default router;
