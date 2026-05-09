import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './api/auth/auth.routes';

export const app = express();

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'KovanEats API is running' });
});

// Mount routes
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});
