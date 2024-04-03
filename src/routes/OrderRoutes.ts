import express from 'express';
import { orderController } from '../controllers/OrderController';

const router = express.Router();

router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getAllOrders);
// Route for getting a single order by ID
router.get('/orders/:id', orderController.getOrderById);
router.patch('/orders/:id/status', orderController.updateOrderStatus);



// Other order routes like GET /orders/:id, PATCH /orders/:id/status, etc.

export default router;
