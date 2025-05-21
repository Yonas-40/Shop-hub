import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasNavigatedAfterLogin, setHasNavigatedAfterLogin] = useState(false); // New state
    const navigate = useNavigate();

    // Check for token on initial load
    useEffect(() => {
        const validateToken = async () => {
            try {
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const userIdFromToken = decodedToken.sub;
                    const userData = await authService.getCurrentUser(token);
                    setUser({ ...userData, id: userIdFromToken }); // Set user with ID from token
                }
            } catch (err) {
                console.log('Token validation error: ', err);
                logout();
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [token]); // Added logout to dependency array

    const login = async (email, password) => {
        try {
            const data = await authService.login({ email, password });
            setToken(data.token);
            localStorage.setItem('token', data.token);
            setHasNavigatedAfterLogin(true);
        } catch (err) {
            setError(err.message || 'Login failed');
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            const data = await authService.register(userData);
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Registration failed');
            throw err;
        }
    };

    const logout = () => {
        authService.logout();
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    // Navigation effect after login
    useEffect(() => {
        if (hasNavigatedAfterLogin && user) { // Ensure user is not null/undefined
            const isAdmin = user.roles?.includes('Admin');
            if (isAdmin) {
                console.log('User has Admin role. Navigating to /admin');
                navigate('/admin');
            } else {
                console.log('User does not have Admin role. Navigating to /');
                navigate('/');
            }
            setHasNavigatedAfterLogin(false);
        }
    }, [hasNavigatedAfterLogin, user, navigate]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                error,
                login,
                register,
                logout,
                isAuthenticated: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);