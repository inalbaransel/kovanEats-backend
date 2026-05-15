import { Router } from 'express';
import { register, login, getProfile } from './auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate as any, getProfile);

export default router;
