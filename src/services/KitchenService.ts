// File: services/KitchenService.ts

import { Order, OrderStatus } from '../../models/Order'; // Adjust import paths as needed

export class KitchenService {
    // Fetch orders by status
    static async getOrdersByStatus(status: OrderStatus) {

        const orders = await Order.findAll({
            where: { status },
            include: [{ all: true, nested: true }] // Adjust based on your association setup
        });
        return orders;
    }

    // Update an order's status
    static async updateOrderStatus(orderId: number, newStatus: OrderStatus): Promise<Order> {
        const order = await Order.findByPk(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        order.status = newStatus;
        await order.save();

        return order;
    }
}
