import { Router } from 'express';

import { register, loginController } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', loginController);
router.get('/protected/', verifyToken, (req, res) => {
  console.log(res);

  return req.body.user;
});

export default router;
