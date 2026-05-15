import { prisma } from '../../utils/prisma';

export const createCategory = async (data: any) => {
  return await prisma.category.create({
    data: {
      name: data.name,
      restaurantId: data.restaurantId,
      sortOrder: data.sortOrder || 0,
    },
  });
};

export const createMenuItem = async (data: any) => {
  return await prisma.menuItem.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      categoryId: data.categoryId,
    },
  });
};

export const updateMenuItem = async (id: string, data: any) => {
  return await prisma.menuItem.update({
    where: { id },
    data,
  });
};

export const deleteMenuItem = async (id: string) => {
  return await prisma.menuItem.delete({
    where: { id },
  });
};

export const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
  });
};
