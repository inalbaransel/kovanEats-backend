import { prisma } from '../../utils/prisma';

export const getAllRestaurants = async () => {
  return await prisma.restaurant.findMany({
    where: { isOpen: true },
    select: {
      id: true,
      name: true,
      description: true,
      logoUrl: true,
      coverUrl: true,
      address: true,
      isOpen: true,
    },
  });
};

export const getRestaurantById = async (id: string) => {
  return await prisma.restaurant.findUnique({
    where: { id },
    include: {
      categories: {
        orderBy: {
          sortOrder: 'asc',
        },
        include: {
          menuItems: {
            include: {
              itemModifiers: {
                include: {
                  modifierGroup: {
                    include: {
                      options: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};
export const getRestaurantByAdminId = async (adminId: string) => {
  return await prisma.restaurant.findFirst({
    where: { adminId },
  });
};

export const createRestaurant = async (data: { name: string; description?: string; address?: string; logoUrl?: string; adminId: string }) => {
  return await prisma.restaurant.create({
    data,
  });
};

export const updateRestaurantSettings = async (id: string, data: { coverUrl?: string; logoUrl?: string }) => {
  return await prisma.restaurant.update({
    where: { id },
    data,
  });
};
