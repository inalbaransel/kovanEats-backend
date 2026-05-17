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
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  const restaurantId = category?.restaurantId;

  const item = await prisma.menuItem.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      categoryId: data.categoryId,
    },
  });

  if (data.modifiers && restaurantId) {
    for (const mod of data.modifiers) {
      await prisma.modifierGroup.create({
        data: {
          name: mod.name,
          isRequired: mod.isRequired,
          minSelection: mod.minSelection,
          maxSelection: mod.maxSelection,
          restaurantId,
          options: {
            create: (mod.options || []).map((opt: any) => ({
              name: opt.name,
              priceAdjustment: opt.priceAdjustment,
            })),
          },
          menuItems: {
            create: {
              menuItemId: item.id
            }
          }
        }
      });
    }
  }

  return item;
};

export const updateMenuItem = async (id: string, data: any) => {
  const { name, description, price, imageUrl, isAvailable, categoryId, modifiers } = data;
  
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  const restaurantId = category?.restaurantId;

  // Mevcut bağlantıları ve grupları bul (Güncelleme için eskileri sileceğiz)
  const existingLinks = await prisma.itemModifierGroup.findMany({
    where: { menuItemId: id },
    select: { modifierGroupId: true }
  });
  const oldGroupIds = existingLinks.map(l => l.modifierGroupId);

  const updated = await prisma.menuItem.update({
    where: { id },
    data: { name, description, price, imageUrl, isAvailable, categoryId },
  });

  if (modifiers && restaurantId) {
    // Eskileri temizle
    if (oldGroupIds.length > 0) {
      await prisma.modifierGroup.deleteMany({
        where: { id: { in: oldGroupIds } }
      });
    }

    // Yenileri oluştur
    for (const mod of modifiers) {
      await prisma.modifierGroup.create({
        data: {
          name: mod.name,
          isRequired: mod.isRequired,
          minSelection: mod.minSelection,
          maxSelection: mod.maxSelection,
          restaurantId,
          options: {
            create: (mod.options || []).map((opt: any) => ({
              name: opt.name,
              priceAdjustment: opt.priceAdjustment,
            })),
          },
          menuItems: {
            create: {
              menuItemId: id
            }
          }
        }
      });
    }
  }

  return updated;
};

export const deleteMenuItem = async (id: string) => {
  return await prisma.menuItem.delete({
    where: { id },
  });
};
