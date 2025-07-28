import { Router } from 'express';

import { register, loginController } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', loginController);

export default router;
