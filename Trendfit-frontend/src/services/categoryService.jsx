// src/services/categoryService.js
import api from './api'; // Assuming your Axios instance

const categoryService = {
    getAllCategories: async (token) => {
        try {
            const response = await api.get('/api/categories', { // Adjust your API endpoint
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    deleteCategory: async (id, token) => {
        try {
            await api.delete(`/api/categories/${id}`, { // Adjust your API endpoint
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error(`Error deleting category ${id}:`, error);
            throw error;
        }
    },
    getCategoryById: async (id, token) => {
        try {
            const response = await api.get(`/api/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching category ${id}:`, error);
            throw error;
        }
    },

    createCategory: async (categoryData, token) => {
        try {
            const response = await api.post('/api/categories', categoryData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    updateCategory: async (id, categoryData, token) => {
        try {
            const response = await api.put(`/api/categories/${id}`, categoryData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating category ${id}:`, error);
            throw error;
        }
    },
    // Add other category service functions like addCategory, updateCategory, etc.
};

export default categoryService;