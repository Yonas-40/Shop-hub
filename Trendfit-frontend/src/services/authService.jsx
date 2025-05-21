import axios from 'axios';

const API_URL = 'https://localhost:5001/api/auth';


const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
};

const getCurrentUser = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        // Handle potential errors (e.g., invalid token)
        console.error("Error fetching current user:", error);
        throw error;
    }
};

const validateToken = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/validate`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; // Or just a boolean based on status
    } catch (error) {
        return false; // Token is likely invalid
    }
};

export default {
    register,
    login,
    logout,
    getCurrentUser,
    validateToken
};