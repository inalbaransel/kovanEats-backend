import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../utils/prisma';
import { ENV } from '../../config/env';

export const registerUser = async (data: any) => {
  const { email, password, name, role, phone } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: role || 'CUSTOMER',
      phone,
    },
  });

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    ENV.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    ENV.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
