import { prisma } from '../../utils/prisma';

export const getMenuByRestaurantId = async (restaurantId: string) => {
  return await prisma.category.findMany({
    where: { restaurantId },
    include: {
      menuItems: {
        include: {
          itemModifiers: {
            include: {
              modifierGroup: {
                include: {
                  options: true
                }
              }
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      },
    },
    orderBy: {
      sortOrder: 'asc',
    },
  });
};

export const createCategory = async (data: any) => {
  return await prisma.category.create({
    data: {
      name: data.name,
      restaurantId: data.restaurantId,
      sortOrder: data.sortOrder || 0,
    },
  });
};

export const updateCategory = async (id: string, data: any) => {
  return await prisma.category.update({
    where: { id },
    data,
  });
};

export const reorderCategories = async (categories: { id: string; sortOrder: number }[]) => {
  const transactions = categories.map((cat) =>
    prisma.category.update({
      where: { id: cat.id },
      data: { sortOrder: cat.sortOrder },
    })
  );
  return await prisma.$transaction(transactions);
};

export const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
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
  const { name, description, price, imageUrl, isAvailable, categoryId } = data;
  return await prisma.menuItem.update({
    where: { id },
    data: {
      name,
      description,
      price,
      imageUrl,
      isAvailable,
      categoryId,
    },
  });
};

export const deleteMenuItem = async (id: string) => {
  return await prisma.menuItem.delete({
    where: { id },
  });
};
