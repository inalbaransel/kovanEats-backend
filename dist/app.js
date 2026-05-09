"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./api/auth/auth.routes"));
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
// Basic health check
exports.app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'KovanEats API is running' });
});
// Mount routes
exports.app.use('/api/auth', auth_routes_1.default);
// Global Error Handler
exports.app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ error: message });
});
