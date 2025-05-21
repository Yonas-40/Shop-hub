import axios from 'axios';

const API_URL = 'https://localhost:5001/api/Products';

const getAllProducts = async (params = {}) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
};

const getFilteredProducts = async (token, filters = {}) => {
    try {
        const response = await axios.get(`${API_URL}/filtered`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: filters
            
        });
        return {
            products: response.data,
            totalCount: response.data.totalCount
        };
    } catch (error) {
        console.error('Error fetching filtered products:', error);
        throw error;
    }
};

const getFeaturedProducts = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/featured`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data; // Access the parsed JSON directly
    } catch (error) {
        console.error('Error fetching featured products:', error);
        throw error;
    }
};

const getNewArrivals = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/new-arrivals`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data; // Access the parsed JSON directly
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
        throw error;
    }
};

const getProductById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

const createProduct = async (productData, token) => {
    const response = await axios.post(API_URL, productData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const updateProduct = async (id, productData, token) => {
    const response = await axios.put(`${API_URL}/${id}`, productData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const deleteProduct = async (id, token) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export default {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    getFeaturedProducts,
    getNewArrivals,
    getFilteredProducts,
    deleteProduct
};