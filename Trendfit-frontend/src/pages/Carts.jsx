import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa6";
import cartService from '../services/cartService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Carts = () => {
    const { token, user } = useAuth();
    const [cartLoading, setCartLoading] = useState(false);
    const [cartError, setCartError] = useState(null);
    const {cartCount, setCartCount} = useCart();

    // Mock cart items for now
    const [cartItems, setCartItems] = useState([]);
    const fetchCartItems = async () => {
        if (token && user?.id) {
            setCartLoading(true);
            setCartError(null);
            try {
                const cartItemsData = await cartService.getCartItems(token, user.id);
                console.log('cartItems: ', cartItemsData);
                setCartItems(cartItemsData); // Update the cartItems state
            } catch (err) {
                console.error("Error fetching cart items:", err);
                setCartError(err.message || 'Failed to fetch cart items.');
                toast.error(err.message || 'Failed to fetch cart items.'); // Optional: Display an error toast
            } finally {
                setCartLoading(false);
            }
        }
    };

    // You might want to fetch cart items when the component mounts or when the user logs in
    useEffect(() => {
        fetchCartItems();
    }, [token, user?.id]); // Re-fetch if token or userId changes

    const handleQuantityChange = (itemId, newQuantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
            )
        );
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const cartItemsData = await cartService.removeItem(token, itemId);
            console.log('cartItems: ', cartItemsData);
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
            const updatedCartItems = await cartService.getCartItems(token, user.id);
            setCartCount(updatedCartItems.length); // Update the cart count
        } catch (err) {
            console.error("Error fetching cart items:", err);
            setCartError(err.message || 'Failed to fetch cart items.');
            toast.error(err.message || 'Failed to fetch cart items.'); // Optional: Display an error toast
        }
        
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="container mx-auto mt-10">
            <div className="shadow-md rounded-lg my-6">
                <div className="border-b border-gray-200">
                    <h1 className="font-bold text-2xl py-4 px-6">Shopping Cart</h1>
                </div>
                {cartItems.length === 0 ? (
                    <div className="p-6 text-gray-500">Your cart is empty.</div>
                ) : (
                    <ul>
                        {cartItems.map(item => (
                            <li key={item.id} className="flex items-center py-4 px-6 border-b border-gray-200">
                                <div className="w-1/4">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover rounded-md" />
                                </div>
                                <div className="ml-4 w-1/2">
                                    <h2 className="text-lg font-medium text-gray-900">{item.product.name}</h2>
                                    <p className="text-gray-600">{item.product.price.toFixed(2)} kr</p>
                                </div>
                                <div className="w-2/4 flex items-center justify-end">
                                    <div className="flex border border-gray-300 rounded-md">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            className="px-2 py-2 hover:bg-gray-100 focus:outline-none"
                                        >
                                            <FaMinus/>
                                        </button>
                                        <input
                                            type="text"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                            className="w-16 text-center border border-gray-200 focus:outling-none"
                                            disabled
                                        />
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            className="px-2 py-1 hover:bg-gray-100 focus:outline-none"
                                        >
                                            <FaPlus/>
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="ml-4 text-gray-500 hover:text-red-500 focus:outline-none"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {cartItems.length > 0 && (
                    <div className="py-4 px-6 border-t border-gray-200 flex justify-between items-center">
                        <h2 className="font-semibold text-lg text-gray-900">Subtotal:</h2>
                        <p className="text-xl font-bold text-gray-900">{calculateSubtotal()} kr</p>
                    </div>
                )}

                {cartItems.length > 0 && (
                    <div className="py-4 px-6 flex justify-end">
                        <Link to="/checkout" className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline !rounded-button whitespace-nowrap">
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Carts;