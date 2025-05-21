import axios from 'axios';

const API_URL = 'https://localhost:5001/api/CartItems';

const CART_ITEMS_ENDPOINT = `${API_URL}`;

const cartService = {
    getCartItems: async (token, userId) => {
        try {
            const response = await axios.get(`${CART_ITEMS_ENDPOINT}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Assuming you are using Bearer token authentication
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching cart items:", error);
            throw error.response?.data?.message || error.message || 'Failed to fetch cart items';
        }
    },

    addToCart: async (token, productId, quantity, userId) => {
        try {
            const response = await axios.post(CART_ITEMS_ENDPOINT, {
                productId,
                quantity,
                userId: userId, // The server should ideally handle the userId from the token
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error adding to cart:", error);
            throw error.response?.data?.message || error.message || 'Failed to add item to cart';
        }
    },

    updateQuantity: async (token, itemId, quantity) => {
        try {
            const response = await axios.put(`${CART_ITEMS_ENDPOINT}/${itemId}`, quantity, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating quantity for item ${itemId}:`, error);
            throw error.response?.data?.message || error.message || 'Failed to update quantity';
        }
    },

    removeItem: async (token, itemId) => {
        try {
            const response = await axios.delete(`${CART_ITEMS_ENDPOINT}/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error removing item ${itemId} from cart:`, error);
            throw error.response?.data?.message || error.message || 'Failed to remove item';
        }
    },

    clearCart: async (token, userId) => {
        try {
            const response = await axios.delete(`${CART_ITEMS_ENDPOINT}/clear/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error clearing cart for user ${userId}:`, error);
            throw error.response?.data?.message || error.message || 'Failed to clear cart';
        }
    },
};

export default cartService;