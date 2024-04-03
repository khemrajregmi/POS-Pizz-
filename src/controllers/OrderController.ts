import { Request, Response } from 'express';
import { orderService } from '../services/OrderService';
import { Order } from '../../models/Order';
import { or } from 'sequelize';
import {OrderResponse} from "../interfaces/OrderInterfaces";

class OrderController {
    async createOrder(req: Request, res: Response) : Promise<OrderResponse>{
        try {
            const orderData = req.body;
            const newOrder = await orderService.createOrderWithItems(orderData);
            res.status(201).json(newOrder);
            return newOrder;
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ error: 'Internal server error' });
            throw error;
        }
    }

    async getAllOrders(req: Request, res: Response) : Promise<Order[]|undefined> {
        try {
            const orders = await orderService.getAllOrders();
            return orders;
            //res.json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getOrderById(req: Request, res: Response) : Promise<Order |undefined> {
        try {
            const orderId = parseInt(req.params.id, 10);
            const order = await orderService.getOrderById(orderId);
            return order;
            //   res.json(order);
        } catch (error) {
            console.error('Error fetching order:', error);
            res.status(404).json({ error: 'Order not found' });
        }
    }

    async updateOrderStatus(req: Request, res: Response): Promise<Order | undefined> {
        try {
            const orderId = parseInt(req.params.id, 10);
            const { status } = req.body;

            // Validate 'status' if necessary, e.g., check if it's one of the allowed OrderStatus values

            const updatedOrder = await orderService.updateOrderStatus(orderId, status);
            return updatedOrder;
            res.json(updatedOrder);
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ error: 'Not found' });
        }
    }
}

export const orderController = new OrderController();
