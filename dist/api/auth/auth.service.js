"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../utils/prisma");
const env_1 = require("../../config/env");
const registerUser = async (data) => {
    const { email, password, name, role, phone } = data;
    const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: role || 'CUSTOMER',
            phone,
        },
    });
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, env_1.ENV.JWT_SECRET, { expiresIn: '1d' });
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, env_1.ENV.JWT_SECRET, { expiresIn: '1d' });
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
};
exports.loginUser = loginUser;
