import { Request, Response, NextFunction } from 'express';
import * as menuService from './menu.service';

export const getMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    const menu = await menuService.getMenuByRestaurantId(restaurantId);
    res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
};

export const addCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await menuService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await menuService.updateCategory(req.params.id, req.body);
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const removeCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {       
  try {
    await menuService.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const addMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await menuService.createMenuItem(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await menuService.updateMenuItem(req.params.id, req.body);
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await menuService.deleteMenuItem(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
