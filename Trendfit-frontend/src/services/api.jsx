const API_BASE_URL = 'https://localhost:5001';  // Change this to your backend URL

// api.jsx (or api.js)
import axios from 'axios';

const api = axios.create({
    baseURL: API_BASE_URL, // Replace with your actual API base URL
    // You can add other default configurations here
});

// Optional: Add interceptors
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
// Users API
export const fetchUserProfile = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/profile`);
    return response.data;
};

export const updateUserProfile = async (userId, profileData) => {
    const response = await axios.put(`${API_BASE_URL}/api/users/${userId}/profile`, profileData);
    return response.data;
};

// Addresses API
export const fetchUserAddresses = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/addresses`);
    return response.data;
};

export const addUserAddress = async (userId, addressData) => {
    const response = await axios.post(`${API_BASE_URL}/api/users/${userId}/addresses`, addressData);
    return response.data;
};

export const updateUserAddress = async (userId, addressId, addressData) => {
    const response = await axios.put(`${API_BASE_URL}/api/users/${userId}/addresses/${addressId}`, addressData);
    return response.data;
};

export const deleteUserAddress = async (userId, addressId) => {
    await axios.delete(`${API_BASE_URL}/api/users/${userId}/addresses/${addressId}`);
};

export const setDefaultAddress = async (userId, addressId) => {
    await axios.patch(`${API_BASE_URL}/api/users/${userId}/addresses/${addressId}/set-default`);
};

// Payment Methods API
export const fetchUserPaymentMethods = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/paymentmethods`);
    return response.data;
};

export const addPaymentMethod = async (userId, paymentData) => {
    const response = await axios.post(`${API_BASE_URL}/api/users/${userId}/paymentmethods`, paymentData);
    return response.data;
};

export const deletePaymentMethod = async (userId, paymentMethodId) => {
    await axios.delete(`${API_BASE_URL}/api/users/${userId}/paymentmethods/${paymentMethodId}`);
};

export const setDefaultPaymentMethod = async (userId, paymentMethodId) => {
    await axios.patch(`${API_BASE_URL}/api/users/${userId}/paymentmethods/${paymentMethodId}/set-default`);
};

// Wishlist API
export const fetchUserWishlist = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/api/wishlist/${userId}`);
    return response.data;
};

export const addToWishlist = async (userId, productId) => {
    const response = await axios.post(`${API_BASE_URL}/api/wishlist`, { userId, productId });
    return response.data;
};

export const removeFromWishlist = async (userId, productId) => {
    await axios.delete(`${API_BASE_URL}/api/wishlist/user/${userId}/product/${productId}`);
};

// Check if product is in wishlist
export const checkWishlistStatus = async (userId, productId) => {
    const response = await axios.get(`${API_BASE_URL}/api/products/${productId}/wishlist-status?userId=${userId}`);
    return response.data;
};

// Shipping Options API
export const fetchShippingOptions = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/api/shippingOptions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching shipping options:', error);
        throw error; // Re-throw the error for the component to handle
    }
};
export default api; // This is the key line
