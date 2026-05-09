"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app_1 = require("./app");
const env_1 = require("./config/env");
const prisma_1 = require("./utils/prisma");
const httpServer = (0, http_1.createServer)(app_1.app);
// Setup Socket.IO
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
    },
});
exports.io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    // Restaurant admins can join a room for their specific restaurant
    socket.on('join_restaurant', (restaurantId) => {
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
        await prisma_1.prisma.$connect();
        console.log('Database connected successfully');
        httpServer.listen(env_1.ENV.PORT, () => {
            console.log(`Server is running on port ${env_1.ENV.PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
bootstrap();
