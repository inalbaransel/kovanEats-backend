import { Router } from 'express';
import { getRestaurants, getRestaurantDetails, getMyRestaurant, createRestaurant, updateMyRestaurant } from './restaurant.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', getRestaurants);
router.post('/', authenticate as any, createRestaurant);
router.get('/my-restaurant', authenticate as any, getMyRestaurant);
router.put('/my-restaurant', authenticate as any, updateMyRestaurant);
router.get('/:id', getRestaurantDetails);

export default router;
