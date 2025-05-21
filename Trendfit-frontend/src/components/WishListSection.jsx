import React, { useState, useEffect } from 'react';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { removeFromWishlist } from '../services/api';
import cartService from '../services/cartService';
import { useAuth } from '../contexts/AuthContext';

export const WishlistSection = ({ userId, items }) => {
    const [wishlistItems, setWishlistItems] = useState(items);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [feedback, setFeedback] = useState({ message: null, type: null });
    const [cartedProducts, setCartedProducts] = useState([]);
    const { token, user } = useAuth();
    const itemsPerPage = 12; // Adjust as needed

    // Pagination logic for wishlist
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentWishlistItems = wishlistItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleRemoveItem = async (productId) => {
        try {
            await removeFromWishlist(userId, productId);
            setWishlistItems(wishlistItems.filter(item => item.productId !== productId));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            await cartService.addToCart(token, productId, 1, user.id); // Assuming quantity is 1
            setCartedProducts(prev => [...prev, productId]);
            setFeedback({
                message: 'Product added to cart!',
                type: 'success'
            });

            // Clear feedback after 3 seconds
            setTimeout(() => {
                setFeedback({ message: null, type: null });
            }, 3000);

        } catch (err) {
            setError(err.message);
            setFeedback({
                message: 'Failed to add to cart',
                type: 'error'
            });
        }
    };
    useEffect(() => {
        setWishlistItems(items); // Update local state when items prop changes
        setCurrentPage(1); // Reset page on new items
    }, [items]);

    return (
        <div className="py-0">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Wishlist</h2>
                <span className="text-gray-500">{wishlistItems.length} items</span>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}
            {feedback.message && (
                <div className={`mb-4 p-2 rounded ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {feedback.message}
                </div>
            )}
            {wishlistItems.length === 0 ? (
                <div className="text-center py-8">
                    <FaHeart className="mx-auto text-gray-300 text-4xl mb-3" />
                    <p className="text-gray-500">Your wishlist is empty</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {currentWishlistItems.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ y: -5 }}
                                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                            >
                                <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                                    {item.productImage ? (
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <FaHeart className="text-red-400 text-4xl" />
                                    )}
                                    <button
                                        onClick={() => handleRemoveItem(item.productId)}
                                        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-100"
                                    >
                                        <FaTrash className="text-red-500" />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-semibold text-gray-800">{item.productName}</h4>
                                    <p className="text-gray-500 text-sm mt-1">${item.productPrice.toFixed(2)}</p>
                                    <div className="flex justify-between mt-3">
                                        <button
                                            onClick={() => handleAddToCart(item.productId)}
                                            disabled={cartedProducts.includes(item.productId)}
                                            className={`text-sm flex items-center ${cartedProducts.includes(item.productId)
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-indigo-500 hover:underline'}`}
                                        >
                                            <FaShoppingCart className="inline mr-1" />
                                            {cartedProducts.includes(item.productId) ? 'Added to Cart' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {wishlistItems.length > itemsPerPage && (
                        <div className="flex justify-center mt-6">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`mx-1 px-3 py-1 rounded-full ${currentPage === number ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-indigo-300'}`}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};