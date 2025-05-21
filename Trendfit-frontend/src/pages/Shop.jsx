// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaShoppingCart, FaThLarge, FaThList } from 'react-icons/fa';
import { FaChevronRight, FaChevronDown, FaChevronLeft, FaStar, FaCheck, FaFilter, FaBorderAll, FaList, FaHeart, FaEye, FaRegHeart } from "react-icons/fa6";
import { Link, useLocation } from 'react-router-dom';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import cartService from '../services/cartService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import QuickViewModal from '../components/QuickViewModal';
import {
    addToWishlist,
    removeFromWishlist,
    fetchUserWishlist
} from '../services/api';
import { useCart } from '../contexts/CartContext';


const Shop = () => {
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [wishlist, setWishlist] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [feedbackType, setFeedbackType] = useState(null); // 'success', 'error', 'info'
    const { cartCount, setCartCount } = useCart();
    const location = useLocation();
    // Filter and pagination states
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [sortOption, setSortOption] = useState('newest');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showFilterSidebar, setShowFilterSidebar] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [selectedRating, setSelectedRating] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [maxPriceFromServer, setMaxPriceFromServer] = useState(0);
    const [cartedProducts, setCartedProducts] = useState([]);
    // Modal state
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await categoryService.getAllCategories(token);
                setCategories(categoriesData);
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError(err.message || "Failed to load categories.");
            }
        };
        fetchCategories();
    }, [token]);

    useEffect(() => {
        const fetchInitialPriceRange = async () => {
            try {
                const response = await productService.getFilteredProducts(token, {
                    page: 1,
                    pageSize: 1 // We just need the price range info
                });

                if (response.products?.minPrice !== undefined && response.products?.maxPrice !== undefined) {
                    setPriceRange([
                        Math.max(0, response.products.minPrice - 100), // Ensure minimum of 0
                        response.products.maxPrice + 100 // Add some padding
                    ]);
                    setMaxPriceFromServer(response.products.maxPrice);
                }
            } catch (err) {
                console.error("Error fetching price range:", err);
            }
        };

        fetchInitialPriceRange();
    }, [token]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryParam = queryParams.get('category');

        if (categoryParam) {
            // Find the category by name (case-insensitive)
            const matchedCategory = categories.find(
                cat => cat.name.toLowerCase() === categoryParam.toLowerCase()
            );

            if (matchedCategory) {
                setSelectedCategories([matchedCategory.id]);
            }
        }
    }, [location.search, categories]); // Run when URL search or categories change

    // Fetch wishlist if user is logged in
    useEffect(() => {
        if (user) {
            const fetchWishlist = async () => {
                try {
                    const wishlistData = await fetchUserWishlist(user.id);
                    setWishlist(wishlistData.map(item => item.productId));
                } catch (err) {
                    console.error("Error fetching wishlist:", err);
                }
            };
            fetchWishlist();
        }
    }, [user, token]);

    // Fetch products with filters
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const filters = {
                    minPrice: priceRange[0],
                    maxPrice: priceRange[1],
                    minRating: selectedRating,
                    categories: selectedCategories.join(','),
                    search: searchQuery,
                    sort: sortOption,
                    page: currentPage,
                    pageSize: itemsPerPage
                };

                const response = await productService.getFilteredProducts(token, filters);
                setProducts(response.products?.products || []);
                setTotalProducts(response.totalCount || 0);
                setError(null);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err.message || "Failed to load products.");
                setProducts([]);
                setTotalProducts(0);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchProducts, 300);
        return () => clearTimeout(debounceTimer);
    }, [
        token, currentPage, itemsPerPage, priceRange,
        selectedRating, selectedCategories, sortOption, searchQuery
    ]);

    // Helper functions
    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(c => c !== categoryId)
                : [...prev, categoryId]
        );
        setCurrentPage(1);
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, maxPriceFromServer]);
        setSelectedRating(null);
        setSearchQuery('');
        setCurrentPage(1);
    };

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= Math.ceil(totalProducts / itemsPerPage)) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0);
        }
    };

    // Product actions
    const addToCart = async (productId) => {
        if (!user) {
            setFeedbackMessage('Please login to add items to cart');
            setFeedbackType('info');
            setTimeout(() => {
                setFeedbackMessage(null);
                setFeedbackType(null);
            }, 3000);
            return;
        }

        try {
            // Check if product is already in cart
            const existingItem = cartedProducts.find(item => item.productId === productId);
            if (existingItem) {
                // Update quantity if already in cart
                await cartService.updateQuantity(
                    token,
                    existingItem.cartItemId,
                    existingItem.quantity + 1,
                    user.id
                );
                setCartedProducts(prev => prev.map(item =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ));
                toast.success('Quantity increased in cart!');
            } else {
                const response = await cartService.addToCart(token, productId, 1, user.id);
                setCartedProducts(prev => [...prev, {
                    productId,
                    cartItemId: response.id,
                    quantity: 1
                }]);
                setFeedbackMessage('Product added to cart!');
                setFeedbackType('success');
                setTimeout(() => {
                    setFeedbackMessage(null);
                    setFeedbackType(null);
                }, 3000);
            }
            // After successfully adding to cart, update the cart count
            const updatedCartItems = await cartService.getCartItems(token, user.id);
            setCartCount(updatedCartItems.length); // Update the cart count
        } catch (err) {
            console.error("Error adding to cart:", err);
            setFeedbackMessage(err.message || 'Failed to add to cart');
            setFeedbackType('error');
            setTimeout(() => {
                setFeedbackMessage(null);
                setFeedbackType(null);
            }, 3000);
        }
    };
    // Add this to your useEffect that runs when user changes
    useEffect(() => {
        if (user) {
            const fetchCart = async () => {
                try {
                    const cartItems = await cartService.getCartItems(token, user.id);
                    setCartedProducts(cartItems.map(item => ({
                        productId: item.productId,
                        cartItemId: item.id,
                        quantity: item.quantity
                    })));
                } catch (err) {
                    console.error("Error fetching cart:", err);
                }
            };
            fetchCart();
        }
    }, [user, token]);
    const toggleWishlist = async (productId) => {
        if (!user) {
            toast.info('Please login to manage your wishlist');
            return;
        }

        try {
            if (wishlist.includes(productId)) {
                await removeFromWishlist(user.id, productId);
                setWishlist(prev => prev.filter(id => id !== productId));
                toast.success('Removed from wishlist');
            } else {
                await addToWishlist(user.id, productId);
                setWishlist(prev => [...prev, productId]);
                toast.success('Added to wishlist!');
            }
        } catch (err) {
            console.error("Error updating wishlist:", err);
            toast.error(err.message || 'Failed to update wishlist');
        }
    };

    const openQuickView = (product) => {
        setQuickViewProduct(product);
        setIsQuickViewOpen(true);
    };

    const closeQuickView = () => {
        setIsQuickViewOpen(false);
        setQuickViewProduct(null);
    };

    // Calculate pagination values
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;

    if (loading) return <div className="text-center py-12">Loading products...</div>;
    if (error) return <div className="text-red-500 text-center py-12">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <main className="pt-16 pb-8 min-h-screen">
                {feedbackMessage && (
                    <div className={`fixed top-16 right-4 z-50 p-4 rounded shadow-lg text-white ${feedbackType === 'success' ? 'bg-green-500' :
                        feedbackType === 'error' ? 'bg-red-500' :
                            feedbackType === 'info' ? 'bg-blue-500' :
                                'bg-gray-500'
                        }`}>
                        {feedbackMessage}
                    </div>
                )}
                {/* Breadcrumb */}
                <div className="bg-gray-100 py-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-2 text-sm">
                                <li>
                                    <Link
                                        to="/home"
                                        className="text-gray-500 hover:text-indigo-600 cursor-pointer"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li className="flex items-center">
                                    <FaChevronRight className="text-gray-400 text-xs mx-1" />
                                    <span className="text-indigo-600 font-medium">Shop</span>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Shop Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Filter Sidebar */}
                        <div className={`md:w-1/4 lg:w-1/5 ${showFilterSidebar ? 'block' : 'hidden md:block'}`}>
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                {/* Categories */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <div key={category.id} className="flex items-center">
                                                <input
                                                    id={`category-${category.id}`}
                                                    type="checkbox"
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                                    checked={selectedCategories.includes(category.id)}
                                                    onChange={() => toggleCategory(category.id)}
                                                />
                                                <label
                                                    htmlFor={`category-${category.id}`}
                                                    className="ml-2 text-sm text-gray-700 cursor-pointer flex-grow"
                                                >
                                                    {category.name}
                                                </label>
                                                <span className="text-xs text-gray-500">({category.products.length})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">{priceRange[0]} SEK</span>
                                            <span className="text-sm text-gray-600">{priceRange[1]} SEK</span>
                                        </div>
                                        <div className="px-2">
                                            <input
                                                type="range"
                                                min="0"
                                                max={maxPriceFromServer}
                                                step="10"
                                                value={priceRange[1]}
                                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex space-x-4">
                                            <div className="w-1/2">
                                                <label htmlFor="min-price" className="sr-only">Minimum Price</label>
                                                <input
                                                    id="min-price"
                                                    type="number"
                                                    min="0"
                                                    max={priceRange[1]}
                                                    value={priceRange[0]}
                                                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    placeholder="Min"
                                                />
                                            </div>
                                            <div className="w-1/2">
                                                <label htmlFor="max-price" className="sr-only">Maximum Price</label>
                                                <input
                                                    id="max-price"
                                                    type="number"
                                                    min={priceRange[0]}
                                                    max="1000"
                                                    value={priceRange[1]}
                                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    placeholder="Max"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Rating</h3>
                                    <div className="space-y-2">
                                        {[5, 4, 3, 2, 1].map((rating) => (
                                            <div
                                                key={rating}
                                                className={`flex items-center py-1 px-2 rounded cursor-pointer ${selectedRating === rating ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                                                onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                                            >
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            className={` text-sm ${i < rating ? '' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-sm text-gray-700">& Up</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="md:w-3/4 lg:w-4/5">
                            {/* Mobile Filter Toggle */}
                            <div className="md:hidden mb-4">
                                <button
                                    onClick={() => setShowFilterSidebar(!showFilterSidebar)}
                                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center !rounded-button whitespace-nowrap cursor-pointer"
                                >
                                    <FaFilter className="mr-2" />
                                    {showFilterSidebar ? 'Hide Filters' : 'Show Filters'}
                                </button>
                            </div>

                            {/* Sort and View Options */}
                            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                                <div className="flex flex-col sm:flex-row justify-between items-center">
                                    <div className="flex items-center mb-4 sm:mb-0">
                                        <span className="text-sm text-gray-500 mr-2">View:</span>
                                        <div className="flex border border-gray-300 rounded-md overflow-hidden">
                                            <button
                                                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} cursor-pointer`}
                                                onClick={() => setViewMode('grid')}
                                            >
                                                <FaBorderAll />
                                            </button>
                                            <button
                                                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} cursor-pointer`}
                                                onClick={() => setViewMode('list')}
                                            >
                                                <FaList />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <button
                                                className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center !rounded-button whitespace-nowrap cursor-pointer"
                                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                            >
                                                <span>Sort by: </span>
                                                <span className="font-medium ml-1">
                                                    {sortOption === 'popularity' && 'Popularity'}
                                                    {sortOption === 'price-low' && 'Price: Low to High'}
                                                    {sortOption === 'price-high' && 'Price: High to Low'}
                                                    {sortOption === 'newest' && 'Newest'}
                                                    {sortOption === 'rating' && 'Rating'}
                                                </span>
                                                <FaChevronDown className="ml-2 text-xs" />
                                            </button>
                                            {showSortDropdown && (
                                                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                                    {[
                                                        { id: 'popularity', name: 'Popularity' },
                                                        { id: 'price-low', name: 'Price: Low to High' },
                                                        { id: 'price-high', name: 'Price: High to Low' },
                                                        { id: 'newest', name: 'Newest' },
                                                        { id: 'rating', name: 'Rating' }
                                                    ].map((option) => (
                                                        <button
                                                            key={option.id}
                                                            className={`block w-full text-left px-4 py-2 text-sm ${sortOption === option.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
                                                                } cursor-pointer`}
                                                            onClick={() => {
                                                                setSortOption(option.id);
                                                                setShowSortDropdown(false);
                                                            }}
                                                        >
                                                            {option.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="hidden sm:block text-sm text-gray-500">
                                            Showing <span className="font-medium">{indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, totalProducts)}</span> of <span className="font-medium">{totalProducts}</span> products
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product Grid/List */}
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition duration-150 cursor-pointer">
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover object-top transition duration-300 hover:scale-105"
                                                />
                                                {product.discount > 0 && (
                                                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                        -{product.discount}%
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => addToCart(product.id)}
                                                    className={`absolute bottom-4 right-4 p-2 rounded shadow-md transition duration-150 ${cartedProducts.some(item => item.productId === product.id)
                                                            ? 'bg-green-500 text-white hover:bg-green-600'
                                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                        }`}
                                                    title={cartedProducts.some(item => item.productId === product.id)
                                                        ? 'Item in cart - click to increase quantity'
                                                        : 'Add to cart'
                                                    }
                                                >
                                                    {cartedProducts.some(item => item.productId === product.id) ? (
                                                        <FaCheck />
                                                    ) : (
                                                        <FaShoppingCart />
                                                    )}
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
                                                <div className="flex items-center mb-2">
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar key={i} className={`${i < Math.floor(product.rating) ? '' : 'text-gray-300'} text-sm`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-gray-500 text-sm ml-1">({product.reviews})</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        {product.discount > 0 ? (
                                                            <div className="flex items-center">
                                                                <span className="text-lg font-bold text-gray-900">
                                                                    {(product.price * (1 - product.discount / 100)).toFixed(2)}:-
                                                                </span>
                                                                <span className="text-sm text-gray-500 line-through ml-2">
                                                                    {product.price.toFixed(2)}:-
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-lg font-bold text-gray-900">
                                                                {product.price.toFixed(2)}:-
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => openQuickView(product)}
                                                        className="text-indigo-600 hover:text-indigo-500 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer"
                                                    >
                                                        Quick View
                                                    </button>
                                                </div>
                                                <div className="mt-2 flex justify-between">
                                                    <button
                                                        onClick={() => toggleWishlist(product.id)}
                                                        className="text-gray-500 hover:text-red-500"
                                                    >
                                                        {wishlist.includes(product.id) ? (
                                                            <FaHeart className="text-red-500" />
                                                        ) : (
                                                            <FaRegHeart />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {products.map((product) => (
                                        <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition duration-150 cursor-pointer">
                                            <div className="flex flex-col md:flex-row">
                                                <div className="md:w-1/4 relative">
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="w-full h-64 md:h-full object-cover object-top"
                                                    />
                                                    {product.discount > 0 && (
                                                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                            -{product.discount}%
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="md:w-3/4 p-6">
                                                    <div className="flex justify-between">
                                                        <h3 className="text-xl font-medium text-gray-900">{product.name}</h3>
                                                        <div className="flex items-center">
                                                            <div className="flex text-yellow-400">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <FaStar key={i} className={`${i < Math.floor(product.rating) ? '' : 'text-gray-300'} text-sm`} />
                                                                ))}
                                                            </div>
                                                            <span className="text-gray-500 text-sm ml-1">({product.reviews})</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 mt-2 mb-4">{product.description}</p>
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {product.colors && product.colors.length > 0 && (
                                                            <div className="flex items-center">
                                                                <span className="text-sm text-gray-600 mr-2">Colors:</span>
                                                                <div className="flex space-x-1">
                                                                    {product.colors.map((color) => (
                                                                        <div
                                                                            key={color.id}
                                                                            className="w-5 h-5 rounded-full border border-gray-300"
                                                                            style={{ backgroundColor: color.hex }}
                                                                            title={color.name}
                                                                        ></div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {product.sizes && product.sizes.length > 0 && (
                                                            <div className="flex items-center">
                                                                <span className="text-sm text-gray-600 mr-2">Sizes:</span>
                                                                <div className="flex space-x-1">
                                                                    {product.sizes.map((size) => (
                                                                        <span key={size.id} className="text-sm text-gray-800 border border-gray-300 px-2 py-1 rounded">
                                                                            {size.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between mt-4">
                                                        <div>
                                                            {product.discount > 0 ? (
                                                                <div className="flex items-center">
                                                                    <span className="text-2xl font-bold text-gray-900">
                                                                        {(product.price * (1 - product.discount / 100)).toFixed(2)}:-
                                                                    </span>
                                                                    <span className="text-lg text-gray-500 line-through ml-2">
                                                                        {product.price.toFixed(2)}:-
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-2xl font-bold text-gray-900">
                                                                    {product.price.toFixed(2)}:-
                                                                </span>
                                                            )}
                                                            <div className="text-sm text-green-600 mt-1">
                                                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                            </div>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => addToCart(product.id)}
                                                                className={`px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition duration-150 flex items-center ${cartedProducts.some(item => item.productId === product.id)
                                                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                                    }`}
                                                            >
                                                                {cartedProducts.some(item => item.productId === product.id) ? (
                                                                    <>
                                                                        <FaCheck className="mr-2" />
                                                                        <span>In Cart ({cartedProducts.find(item => item.productId === product.id)?.quantity || 1})</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FaShoppingCart className="mr-2" />
                                                                        <span>Add to Cart</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => toggleWishlist(product.id)}
                                                                className={`px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-150 !rounded-button whitespace-nowrap cursor-pointer ${wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-700 bg-gray-100'}`}
                                                            >
                                                                <FaHeart />
                                                            </button>
                                                            <button
                                                                onClick={() => openQuickView(product)}
                                                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-150 !rounded-button whitespace-nowrap cursor-pointer"
                                                            >
                                                                <FaEye />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                                            } !rounded-button whitespace-nowrap`}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                                            } !rounded-button whitespace-nowrap`}
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to <span className="font-medium">{Math.min(indexOfLastProduct, totalProducts)}</span> of{' '}
                                            <span className="font-medium">{totalProducts}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                                                    }`}
                                            >
                                                <span className="sr-only">Previous</span>
                                                <FaChevronLeft className="text-xs" />
                                            </button>
                                            {[...Array(totalPages)].map((_, index) => {
                                                const pageNumber = index + 1;
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        onClick={() => paginate(pageNumber)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNumber
                                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            } cursor-pointer`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            })}
                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                                                    }`}
                                            >
                                                <span className="sr-only">Next</span>
                                                <FaChevronRight className="text-xs" />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Quick View Modal */}
            {isQuickViewOpen && quickViewProduct && (
                <QuickViewModal
                    product={quickViewProduct}
                    onClose={closeQuickView}
                    onAddToCart={() => {
                        addToCart(quickViewProduct.id, quantity);
                        closeQuickView();
                    }}
                    onToggleWishlist={() => toggleWishlist(quickViewProduct.id)}
                    isInWishlist={wishlist.includes(quickViewProduct.id)}
                />
            )}
        </div>
    );
};

export default Shop;