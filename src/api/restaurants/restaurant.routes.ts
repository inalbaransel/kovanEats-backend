import { Router } from 'express';
import { getRestaurants, getRestaurantDetails } from './restaurant.controller';

const router = Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurantDetails);

export default router;
