import { Router } from 'express';
import { getRestaurants, getRestaurantDetails, getMyRestaurant } from './restaurant.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', getRestaurants);
router.get('/my-restaurant', authenticate as any, getMyRestaurant);
router.get('/:id', getRestaurantDetails);

export default router;
