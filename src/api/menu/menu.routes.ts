import { Router } from 'express';
import { 
  getMenu, 
  addCategory, 
  updateCategory, 
  reorderCategories,
  removeCategory, 
  addMenuItem, 
  updateMenuItem, 
  removeItem 
} from './menu.controller';
import { authenticate, authorizeRole } from '../../middlewares/auth.middleware';

const router = Router();

// Herkes menüyü görebilir
router.get('/:restaurantId', getMenu);

// Sadece restoran admini yönetebilir
router.post('/category', authenticate as any, authorizeRole('RESTAURANT_ADMIN'), addCategory);
router.put('/category/reorder', authenticate as any, authorizeRole('RESTAURANT_ADMIN'), reorderCategories);
router.put('/category/:id', authenticate as any, authorizeRole('RESTAURANT_ADMIN'), updateCategory);
router.delete('/category/:id', authenticate as any, authorizeRole('RESTAURANT_ADMIN'), removeCategory);

router.post('/item', authenticate as any, authorizeRole('RESTAURANT_ADMIN'), addMenuItem);
router.put('/item/:id', authenticate as any, authorizeRole('RESTAURANT_ADMIN'), updateMenuItem);
router.delete('/item/:id', authenticate as any, authorizeRole('RESTAURANT_ADMIN'), removeItem);

export default router;
