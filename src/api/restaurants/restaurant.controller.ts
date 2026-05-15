import { Request, Response, NextFunction } from 'express';
import * as restaurantService from './restaurant.service';

export const getRestaurants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    res.status(200).json(restaurants);
  } catch (error) {
    next(error);
  }
};

export const getRestaurantDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const restaurant = await restaurantService.getRestaurantById(id);
    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }
    res.status(200).json(restaurant);
  } catch (error) {
    next(error);
  }
};
