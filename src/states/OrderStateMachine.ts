import { assign, setup } from 'xstate';
import { OrderItem } from '../../models/OrderItem';
import { Order } from '../../models/Order';


export enum OrderMachineState {
    SHOPPING = "shopping",
    ADD_TO_CART = "add_to_cart",
    CHECKOUT = "checkout",
    CHECKING_OUT = "checkingOut",
    PAYMENT_LOADING = "payment_loading",
    PAYMENT_FAILURE = 'payment_failure',
    PAYMENT_SUCCESS = 'payment_success',
    PAYMENT_RETRY = 'paymentRetry',
    IN_KITCHEN = "inKitchen",
    PREPARING_ORDER = "preparingOrder",
    READY_FOR_PICK_UP = "ready_for_pickup",
    OUT_FOR_DELIVERY = "out_for_delivery",
    ORDER_DELIVERED = "order_delivered",
    COMPLETED = "completed",
}

export const orderInitialState = setup({
    types: {
        context: {} as {
            orderId: number,
            status: OrderMachineState,
            items: OrderItem[],
        },
        input: {} as {
            orderId: number,
            status: OrderMachineState,
            items: OrderItem[],
        },
    }
}).createMachine({
    context: ({input}) => ({
        orderId: input.orderId,
        status: input.status,
        items: input.items,
    }),
    id: "order",
    initial: OrderMachineState.SHOPPING,
    states: {
        [ OrderMachineState.SHOPPING ]: {
            on: {
                [ OrderMachineState.CHECKOUT ]: {
                    guard: ({context}, params) => {
                        if (context.status != OrderMachineState.SHOPPING || context.items.length == 0) {
                            return false
                        }
                        return true
                    },
                    target: [ OrderMachineState.CHECKING_OUT ],
                    actions: async ({context}) => {
                        const order =  await Order.findByPk(context.orderId)

                        if (!order) {
                            return
                        }

                        await order.update({status: OrderMachineState.CHECKING_OUT});

                        order.save();

                        assign({
                            id: context.orderId,
                            items: context.items,
                            status: OrderMachineState.CHECKING_OUT,
                        })
                    }
                },

                [ OrderMachineState.ADD_TO_CART ]: {
                    guard: ({context}) => {
                        if (context.status != OrderMachineState.SHOPPING) {
                            return false
                        }

                        return true
                    },
                    target: [ OrderMachineState.SHOPPING ],
                    actions: async ({context, event}) => {
                        const {pizzaId, quantity, orderId} = event

                        const orderItem =  await OrderItem.create({
                            order_id: orderId,
                            pizza_id: pizzaId,
                            quantity: quantity,
                        })

                        assign({
                            id: context.orderId,
                            items: [...context.items, orderItem],
                            status: OrderMachineState.CHECKING_OUT,
                        })
                    }
                }
            },
        },
        [ OrderMachineState.CHECKING_OUT ]: {
            initial: OrderMachineState.PAYMENT_LOADING,
            states: {
                [ OrderMachineState.PAYMENT_LOADING ]: {
                    on: {
                        [ OrderMachineState.PAYMENT_SUCCESS ]: {
                            target: OrderMachineState.IN_KITCHEN,
                            actions: async ({context}, params) => {
                                const order = await Order.findByPk(context.orderId)

                                if (!order) {
                                    return
                                }

                                await order.update({status: OrderMachineState.PAYMENT_SUCCESS})

                                assign({
                                    id: context.orderId,
                                    items: context.items,
                                    status: OrderMachineState.PAYMENT_SUCCESS,
                                })
                            }
                        },
                        [ OrderMachineState.PAYMENT_FAILURE ]: {
                            target: OrderMachineState.PAYMENT_LOADING,
                            actions: async ({context}, params) => {
                                const order = await Order.findByPk(context.orderId)

                                if (!order) {
                                    return
                                }

                                await order.update({status: OrderMachineState.PAYMENT_FAILURE})

                                assign({
                                    id: context.orderId,
                                    items: context.items,
                                    status: OrderMachineState.PAYMENT_FAILURE,
                                })
                            }
                        },
                    },
                },
                [ OrderMachineState.IN_KITCHEN ]: {
                    initial: OrderMachineState.PREPARING_ORDER,
                    entry: async ({context}) => {
                        const order = await Order.findByPk(context.orderId)

                        if (!order) {
                            return
                        }

                        await order.update({status: OrderMachineState.PREPARING_ORDER})
                    },
                    states: {
                        [ OrderMachineState.PREPARING_ORDER ]: {
                            on: {
                                [OrderMachineState.READY_FOR_PICK_UP]: {
                                    target: OrderMachineState.READY_FOR_PICK_UP,
                                }
                            },
                        },
                        [ OrderMachineState.READY_FOR_PICK_UP ]: {
                            on: {
                                [OrderMachineState.OUT_FOR_DELIVERY]: {
                                    target: OrderMachineState.OUT_FOR_DELIVERY
                                }
                            }
                        },
                        [ OrderMachineState.OUT_FOR_DELIVERY ]: {
                            on: {
                                [OrderMachineState.ORDER_DELIVERED]: {
                                    target: OrderMachineState.ORDER_DELIVERED,
                                }
                            }

                        },
                        [OrderMachineState.ORDER_DELIVERED]: {
                            on: {
                                [ OrderMachineState.COMPLETED ]: {
                                    target: OrderMachineState.COMPLETED,
                                }
                            },
                        },
                        [OrderMachineState.COMPLETED]: {
                            type: 'final',
                            entry: async ({context}, params) => {
                                const order = await Order.findByPk(context.orderId)

                                if (!order) {
                                    return
                                }

                                await order.update({status: OrderMachineState.COMPLETED})

                                assign({
                                    id: context.orderId,
                                    items: context.items,
                                    status: OrderMachineState.COMPLETED,
                                })
                            }
                        }
                    }
                },
            },
        }
    },
})