// src/services/supplierService.js
import api from './api'; // Assuming your Axios instance is configured in './api'

const supplierService = {
    getAllSuppliers: async (token) => {
        try {
            const response = await api.get('/api/suppliers', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            throw error;
        }
    },

    getSupplierById: async (id, token) => {
        try {
            const response = await api.get(`/api/suppliers/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching supplier ${id}:`, error);
            throw error;
        }
    },

    createSupplier: async (supplierData, token) => {
        try {
            const response = await api.post('/api/suppliers', supplierData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating supplier:', error);
            throw error;
        }
    },

    updateSupplier: async (id, supplierData, token) => {
        try {
            const response = await api.put(`/api/suppliers/${id}`, supplierData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating supplier ${id}:`, error);
            throw error;
        }
    },

    deleteSupplier: async (id, token) => {
        try {
            await api.delete(`/api/suppliers/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error(`Error deleting supplier ${id}:`, error);
            throw error;
        }
    },
};

export default supplierService;