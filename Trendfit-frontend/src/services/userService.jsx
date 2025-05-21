import api from './api'; // Assuming you have your Axios instance configured here


const userService = {
    getAllUsers: async (token) => {
        try {
            const response = await api.get('/api/Users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error.response?.data?.message || 'Failed to fetch users';
        }
    },

    deleteUser: async (id, token) => {
        try {
            const response = await api.delete(`/api/Users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    getUserById: async (id, token) => {
        try {
            const response = await api.get(`/api/Users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching user with ID ${id}:`, error);
            throw error;
        }
    },
};
export default userService;