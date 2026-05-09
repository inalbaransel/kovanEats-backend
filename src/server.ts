import { createServer } from 'http';
import { Server } from 'socket.io';
import { app } from './app';
import { ENV } from './config/env';
import { prisma } from './utils/prisma';

const httpServer = createServer(app);

// Setup Socket.IO
export const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Restaurant admins can join a room for their specific restaurant
  socket.on('join_restaurant', (restaurantId: string) => {
    socket.join(`restaurant_${restaurantId}_orders`);
    console.log(`Socket ${socket.id} joined room restaurant_${restaurantId}_orders`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

async function bootstrap() {
  try {
    // Try to connect to DB (optional, prisma connects automatically, but good for check)
    await prisma.$connect();
    console.log('Database connected successfully');
    
    httpServer.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
