import React from 'react';
import { FaTimes, FaShoppingCart, FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';

const QuickViewModal = ({ product, onClose, onAddToCart, onToggleWishlist, isInWishlist }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold">{product.name}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <FaTimes />
                        </button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/2">
                            <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                        
                        <div className="md:w-1/2">
                            <div className="flex items-center mb-2">
                                <div className="flex text-yellow-400 mr-2">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < Math.floor(product.rating) ? '' : 'text-gray-300'} />
                                    ))}
                                </div>
                                <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
                            </div>
                            
                            <div className="mb-4">
                                {product.discount > 0 ? (
                                    <div className="flex items-center">
                                        <span className="text-2xl font-bold text-gray-900 mr-2">
                                            {(product.price * (1 - product.discount / 100)).toFixed(2)}:-
                                        </span>
                                        <span className="text-lg text-gray-500 line-through">
                                            {product.price.toFixed(2)}:-
                                        </span>
                                        <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                                            {product.discount}% OFF
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-2xl font-bold text-gray-900">
                                        {product.price.toFixed(2)}:-
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-gray-600 mb-6">{product.description}</p>
                            
                            <div className="flex space-x-4">
                                <button
                                    onClick={onAddToCart}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-150 flex items-center"
                                >
                                    <FaShoppingCart className="mr-2" />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={onToggleWishlist}
                                    className={`px-4 py-3 rounded-lg border flex items-center ${isInWishlist ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-700'}`}
                                >
                                    {isInWishlist ? <FaHeart /> : <FaRegHeart />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;