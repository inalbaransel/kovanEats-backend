import { Router } from 'express';
import { addCategory, addMenuItem, removeCategory, removeItem } from './menu.controller';
import { authenticate, authorizeRole } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/category', authenticate as any, authorizeRole('RESTAURANT_ADMIN'), addCategory);
router.post('/item', authenticate as any, authorizeRole('RESTAURANT_ADMIN'), addMenuItem);
router.delete('/category/:id', authenticate as any, authorizeRole('RESTAURANT_ADMIN'), removeCategory);
router.delete('/item/:id', authenticate as any, authorizeRole('RESTAURANT_ADMIN'), removeItem);

export default router;
