import { createContext, useState, useContext, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const { token, user } = useAuth();

    const fetchCartCount = async () => {
        if (token && user?.id) {
            try {
                const cartItems = await cartService.getCartItems(token, user.id);
                setCartCount(cartItems.length);
            } catch (err) {
                console.error("Error fetching cart count:", err);
            }
        }
    };

    // Fetch cart count when user logs in or token changes
    useEffect(() => {
        fetchCartCount();
    }, [token, user?.id]);

    return (
        <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);