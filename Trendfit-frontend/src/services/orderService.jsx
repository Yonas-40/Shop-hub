import api from './api'; // Assuming you have your Axios instance configured here


const orderService = {
    getAllOrders: async (token) => {
        try {
            const response = await api.get('/api/orders', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching all orders:', error);
            throw error.response?.data?.message || 'Failed to fetch orders';
        }
    },

    getOrderById: async (orderId, token) => {
        try {
            const response = await api.get(`/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching order with ID ${orderId}:`, error);
            throw error.response?.data?.message || 'Failed to fetch order details';
        }
    },

    updateOrderStatus: async (orderId, statusData, token) => {
        try {
            const response = await api.patch(`/api/orders/${orderId}`, statusData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating order status for ID ${orderId}:`, error);
            throw error.response?.data?.message || 'Failed to update order status';
        }
    },

    // Add other order-related API calls as needed (e.g., creating orders)
    createOrder: async (orderData, token, userId) => {
        try {
            const response = await api.post(`/api/orders/checkout/${userId}`, {
                userId: orderData.userId,
                shippingOptionId: orderData.shippingOptionId,
                shippingAddressId: orderData.shippingAddressId,
                paymentMethodId: orderData.paymentMethodId  // Changed from paymentMethod to paymentMethodId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error.response?.data?.message || 'Failed to create order';
        }
    },

    getOrderDetails: async (orderId, token) => {
        try {
            const response = await api.get(`/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching order details:', error);
            throw error.response?.data?.message || 'Failed to fetch order details';
        }
    },

    getUserOrders: async (userId, token) => {
        try {
            const response = await api.get(`/api/orders/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user orders:', error);
            throw error.response?.data?.message || 'Failed to fetch orders';
        }
    }
};

export default orderService;