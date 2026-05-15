import { Router } from 'express';
import { createOrder, getMyOrders, getRestaurantOrders, updateStatus } from './order.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate as any, createOrder);
router.get('/my-orders', authenticate as any, getMyOrders);
router.get('/restaurant/:restaurantId', authenticate as any, getRestaurantOrders);
router.patch('/:id/status', authenticate as any, updateStatus);

export default router;
