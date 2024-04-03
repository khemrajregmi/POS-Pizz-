// File: controllers/KitchenController.ts

import { Request, Response } from 'express';
import { KitchenService } from '../services/KitchenService';
import { Order, OrderStatus } from '../../models/Order'; // Adjust import paths as needed

export class KitchenController {
    // Handle HTTP request to list orders by status
    static async listOrdersByStatus(req: Request, res: Response)    : Promise<Order[] | undefined>{
        try {
            const status = req.params.status as OrderStatus;
            //return 'test';
            const orders = await KitchenService.getOrdersByStatus(status);
            return orders;
            //   res.json(orders);
        } catch (error) {
            console.error('Error listing orders:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Handle HTTP request to update order status
    static async updateOrderStatus(req: Request, res: Response)  : Promise<Order | undefined>  {
        try {
            const orderId = parseInt(req.params.id, 10);
            const { status } = req.body;
            const updatedOrder = await KitchenService.updateOrderStatus(orderId, status);
            return updatedOrder;

            //res.json(updatedOrder);
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
