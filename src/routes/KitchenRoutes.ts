// File: routes/kitchenRoutes.ts

import express from 'express';
import { KitchenController } from '../controllers/KitchenController';

const router = express.Router();

// Route to list orders by status
router.get('/kitchen/orders/:status', KitchenController.listOrdersByStatus);

// Route to update order status
router.patch('/kitchen/orders/:id/status', KitchenController.updateOrderStatus);

export default router;
