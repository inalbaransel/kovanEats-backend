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
    const restaurant = await restaurantService.getRestaurantById(id as string);
    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }
    res.status(200).json(restaurant);
  } catch (error) {
    next(error);
  }
};

export const getMyRestaurant = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = req.user?.userId;
    if (!adminId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const restaurant = await restaurantService.getRestaurantByAdminId(adminId);
    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }
    res.status(200).json(restaurant);
  } catch (error) {
    next(error);
  }
};

export const createRestaurant = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = req.user?.userId;
    if (!adminId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { name, description, address, logoUrl } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Restaurant name is required' });
      return;
    }

    const restaurant = await restaurantService.createRestaurant({
      name,
      description,
      address,
      logoUrl,
      adminId,
    });

    res.status(201).json(restaurant);
  } catch (error) {
    next(error);
  }
};

export const updateMyRestaurant = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = req.user?.userId;
    if (!adminId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const restaurant = await restaurantService.getRestaurantByAdminId(adminId);
    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    const { coverUrl, logoUrl } = req.body;
    
    const updatedRestaurant = await restaurantService.updateRestaurantSettings(restaurant.id, {
      coverUrl,
      logoUrl,
    });

    res.status(200).json(updatedRestaurant);
  } catch (error) {
    next(error);
  }
};
