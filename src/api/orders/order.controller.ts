import { Request, Response, NextFunction } from 'express';
import * as orderService from './order.service';

export const createOrder = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customerId = req.user?.userId;
    const order = await orderService.createOrder({ ...req.body, customerId });
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customerId = req.user?.userId;
    const orders = await orderService.getOrdersByCustomer(customerId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getRestaurantOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    const orders = await orderService.getOrdersByRestaurant(restaurantId as string);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(id as string, status);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
