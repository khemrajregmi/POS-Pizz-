// services/orderService.ts


import { Order , OrderStatus } from '../../models/Order';
import { OrderItem } from '../../models/OrderItem';
import {OrderData,PizzaOrderData, OrderResponse} from '../interfaces/OrderInterfaces';
import {sequelizeConnection} from "../../config/sequelize";
import {Pizza} from "../../models/Pizza";

class OrderService {
    async createOrderWithItems(orderData: PizzaOrderData): Promise<OrderResponse> {
        const transaction = await sequelizeConnection.transaction();
        const { name, description, price, quantity } = orderData;

        try {
            // Create Pizza
            const pizza = await Pizza.create({
                name,
                description,
                price
            }, { transaction });

            // Create Order
            const userId = 1; // Placeholder: Replace with actual user ID
            const order = await Order.create({
                user_id: userId,
                status: OrderStatus.Pending
            }, { transaction });

            // Create OrderItem
            await OrderItem.create({
                order_id: order.order_id,
                pizza_id: pizza.pizza_id,
                quantity,
                total_price: price * quantity
            }, { transaction });

            await transaction.commit();

            // Construct the response object
            const response: OrderResponse = {
                message: 'Order created successfully!',
                order: {
                    orderId: order.order_id,
                    status: order.status,
                    items: [{
                        pizza: pizza.name,
                        quantity,
                        totalPrice: price * quantity
                    }]
                }
            };

            return response;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getAllOrders(): Promise<Order[]> {
        return await Order.findAll({
            include: [{ model: OrderItem, as: 'orderItems' }]
        });
    }

    async getOrderById(orderId: number) : Promise<Order>{
        const order = await Order.findByPk(orderId, {
            include: [{ model: OrderItem, as: 'items' }]
        });
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    async updateOrderStatus(orderId: number, newStatus: OrderStatus) : Promise<Order>{
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error("Order not found");

        order.status = newStatus;
        await order.save();
        return order;
    }
}

export const orderService = new OrderService();
