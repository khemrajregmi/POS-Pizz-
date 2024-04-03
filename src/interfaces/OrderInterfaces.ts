
interface OrderItemData {
    pizzaId: number;
    quantity: number;
  }

  export interface OrderData {
    userId: number;
    items: OrderItemData[];
  }

  export interface PizzaOrderData  {
    name: string;
    description: string;
    price: number;
    quantity: number;
  }

  export interface OrderResponse {
        message: string;
        order: {
            orderId: number;
            status: string;
            items: Array<{
                pizza: string;
                quantity: number;
                totalPrice: number;
            }>;
        };
  }