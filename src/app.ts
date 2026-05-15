import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './api/auth/auth.routes';
import restaurantRoutes from './api/restaurants/restaurant.routes';
import orderRoutes from './api/orders/order.routes';
import menuRoutes from './api/menu/menu.routes';

export const app = express();

app.use(cors({
  origin: true, // Gelen isteğin origin'ine izin ver (geliştirme aşamasında hayat kurtarır)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Basic health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'KovanEats API is running' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});
