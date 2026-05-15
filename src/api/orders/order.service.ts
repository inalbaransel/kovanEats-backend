import { prisma } from '../../utils/prisma';
import { io } from '../../server';

export const createOrder = async (data: any) => {
  const { customerId, restaurantId, orderType, items, totalAmount, notes, tableId } = data;

  const order = await prisma.order.create({
    data: {
      customerId,
      restaurantId,
      orderType,
      totalAmount,
      notes,
      tableId,
      items: {
        create: items.map((item: any) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          // If we had modifiers, we would add them here
        })),
      },
    },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
      customer: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
  });

  // Emit socket event to the restaurant room
  io.to(`restaurant_${restaurantId}_orders`).emit('new_order', order);

  return order;
};

export const getOrdersByCustomer = async (customerId: string) => {
  return await prisma.order.findMany({
    where: { customerId },
    include: {
      restaurant: true,
      items: {
        include: {
          menuItem: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getOrdersByRestaurant = async (restaurantId: string) => {
  return await prisma.order.findMany({
    where: { restaurantId },
    include: {
      customer: true,
      items: {
        include: {
          menuItem: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateOrderStatus = async (orderId: string, status: any) => {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  // Notify customer or restaurant about status change if needed
  io.emit(`order_status_updated`, { orderId, status });

  return order;
};
