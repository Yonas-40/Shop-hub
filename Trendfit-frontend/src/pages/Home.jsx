import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaShoppingCart, FaSearch, FaLaptop, FaTshirt, FaSpa, FaRunning } from 'react-icons/fa';
import { FaChevronRight, FaChevronDown, FaChevronLeft, FaPlus, FaStar, FaHouse, FaArrowRight, FaCheck, FaFilter, FaBorderAll, FaList } from "react-icons/fa6";
import { MdFastfood, MdFitnessCenter } from "react-icons/md";
import productService from '../services/productService';
import cartService from '../services/cartService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import QuickViewModal from '../components/QuickViewModal';

const Home = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, user } = useAuth();
    const { cartCount, setCartCount } = useCart();
    const navigate = useNavigate();
    const [cartedProducts, setCartedProducts] = useState([]);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    // Fetch home page data
    useEffect(() => {
        const fetchHomePageData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [featuredData, newArrivalsData] = await Promise.all([
                    productService.getFeaturedProducts(token),
                    productService.getNewArrivals(token)
                ]);

                setFeaturedProducts(featuredData);
                setNewArrivals(newArrivalsData);
            } catch (err) {
                console.error('Error fetching home page data:', err);
                setError(err.message || 'Failed to load products.');
                toast.error('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchHomePageData();
    }, [token]);

    // Fetch cart items if user is logged in
    useEffect(() => {
        if (user) {
            const fetchCartItems = async () => {
                try {
                    const cartItems = await cartService.getCartItems(token, user.id);
                    setCartedProducts(cartItems.map(item => ({
                        productId: item.productId,
                        cartItemId: item.id,
                        quantity: item.quantity
                    })));
                } catch (err) {
                    console.error('Error fetching cart items:', err);
                }
            };
            fetchCartItems();
        }
    }, [user, token, cartCount]);

    const categories = [
        { id: 1, name: 'All', icon: <FaBorderAll className="text-indigo-600 text-xl" /> },
        { id: 2, name: 'Electronics', icon: <FaLaptop className="text-indigo-600 text-xl" /> },
        { id: 3, name: 'Fashion', icon: <FaTshirt className="text-indigo-600 text-xl" /> },
        { id: 4, name: 'Nutrition & Supplements', icon: <MdFastfood className="text-indigo-600 text-xl" /> },
        { id: 5, name: 'Accessories', icon: <FaSpa className="text-indigo-600 text-xl" /> },
        { id: 6, name: 'SportsWear', icon: <FaRunning className="text-indigo-600 text-xl" /> },
        { id: 7, name: 'Fitness Equipment', icon: <MdFitnessCenter className="text-indigo-600 text-xl" /> }
    ];

    const handleAddToCart = async (productId) => {
        if (!user) {
            toast.info('Please login to add items to cart');
            navigate('/login');
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
                toast.success('Quantity increased in cart!');
            } else {
                const response = await cartService.addToCart(token, productId, 1, user.id);
                setCartedProducts(prev => [...prev, {
                    productId,
                    cartItemId: response.id,
                    quantity: 1
                }]);
                toast.success('Product added to cart!');
            }

            // Update cart count
            const updatedCartItems = await cartService.getCartItems(token, user.id);
            setCartCount(updatedCartItems.length);
        } catch (err) {
            console.error("Error adding to cart:", err);
            toast.error(err.message || 'Failed to add to cart');
        }
    };

    const handleQuickView = (product) => {
        setQuickViewProduct(product);
        setIsQuickViewOpen(true);
    };

    const closeQuickView = () => {
        setIsQuickViewOpen(false);
        setQuickViewProduct(null);
    };

    const handleCategoryChange = (categoryName) => {
        setActiveCategory(categoryName);
        navigate(`/shop?category=${encodeURIComponent(categoryName.toLowerCase())}`);
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        toast.success('Subscription saved!');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <main className="pt-16 pb-8">
                {/* Hero Section */}
                <section className="relative h-[500px] overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20e-commerce%20shopping%20scene%20with%20elegant%20gradient%20background%20transitioning%20from%20light%20blue%20to%20soft%20purple%2C%20featuring%20stylish%20electronics%20and%20fashion%20items%20arranged%20artistically%20with%20soft%20shadows%20and%20highlights%2C%20professional%20product%20photography%20style%20with%20high%20detail%20and%20contrast&width=1440&height=500&seq=9&orientation=landscape')`
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 to-transparent"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                        <div className="max-w-lg">
                            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                                Summer Collection <span className="block text-indigo-200">2025</span>
                            </h1>
                            <p className="mt-3 text-base text-white sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
                                Discover the latest trends and exclusive deals on our premium products.
                            </p>
                            <div className="mt-8 flex space-x-4">
                                <button
                                    onClick={() => navigate('/shop')}
                                    className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-medium shadow-md transition duration-150 ease-in-out"
                                >
                                    Shop Now
                                </button>
                                <button
                                    onClick={() => navigate('/about')}
                                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition duration-150 ease-in-out"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.name)}
                                    className={`bg-gray-50 rounded-xl p-6 text-center transition duration-150 hover:shadow-md cursor-pointer ${activeCategory === category.name ? 'bg-indigo-50 ring-2 ring-indigo-500' : ''
                                        }`}
                                >
                                    <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                        {category.icon}
                                    </div>
                                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className="py-12 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                            <button
                                onClick={() => navigate('/shop')}
                                className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
                            >
                                View All <FaArrowRight className="ml-2" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-8">Loading featured products...</div>
                        ) : error ? (
                            <div className="text-red-500 py-8">{error}</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {featuredProducts.map((product) => {
                                    const isInCart = cartedProducts.some(item => item.productId === product.id);
                                    const cartItem = cartedProducts.find(item => item.productId === product.id);

                                    return (
                                        <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition duration-150">
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
                                                    onClick={() => handleAddToCart(product.id)}
                                                    className={`absolute bottom-4 right-4 p-2 rounded shadow-md transition duration-150 ${isInCart
                                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                        }`}
                                                    title={isInCart
                                                        ? `Item in cart (${cartItem?.quantity || 1}) - click to increase quantity`
                                                        : 'Add to cart'
                                                    }
                                                >
                                                    {isInCart ? <FaCheck /> : <FaShoppingCart />}
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
                                                    <span className="text-gray-500 text-sm ml-1">({product.rating})</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        {product.discount > 0 ? (
                                                            <div className="flex items-center">
                                                                <span className="text-lg font-bold text-gray-900">
                                                                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                                                </span>
                                                                <span className="text-sm text-gray-500 line-through ml-2">
                                                                    ${product.price.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-lg font-bold text-gray-900">
                                                                ${product.price.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleQuickView(product)}
                                                        className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                                                    >
                                                        Quick View
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* Banner */}
                <section className="py-16 bg-indigo-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            <span className="block">Ready to dive in?</span>
                            <span className="block">Start shopping today</span>
                        </h2>
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => navigate('/shop')}
                                className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-medium transition duration-150 ease-in-out"
                            >
                                Shop Now
                            </button>
                        </div>
                    </div>
                </section>

                {/* New Arrivals */}
                <section className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
                            <button
                                onClick={() => navigate('/shop?sort=newest')}
                                className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
                            >
                                View All <FaArrowRight className="ml-2" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-8">Loading new arrivals...</div>
                        ) : error ? (
                            <div className="text-red-500 py-8">{error}</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {newArrivals.map((product) => {
                                    const isInCart = cartedProducts.some(item => item.productId === product.id);
                                    const cartItem = cartedProducts.find(item => item.productId === product.id);

                                    return (
                                        <div key={product.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition duration-150">
                                            <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover object-top transition duration-300 hover:scale-105"
                                                />
                                            </div>
                                            <div>
                                                <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                                                    {product.categoryName}
                                                </span>
                                                <h3 className="mt-2 text-lg font-medium text-gray-900">{product.name}</h3>
                                                <div className="mt-1 flex justify-between items-center">
                                                    <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                                    <button
                                                        onClick={() => handleAddToCart(product.id)}
                                                        className={`p-2 rounded-full shadow-sm transition duration-150 ${isInCart
                                                            ? 'bg-green-500 text-white hover:bg-green-600'
                                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                            }`}
                                                        title={isInCart
                                                            ? `Item in cart (${cartItem?.quantity || 1}) - click to increase quantity`
                                                            : 'Add to cart'
                                                        }
                                                    >
                                                        {isInCart ? <FaCheck /> : <FaPlus />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* Newsletter */}
                <section className="py-12 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                            <div className="text-center max-w-2xl mx-auto">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Subscribe to our newsletter</h2>
                                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-grow px-4 py-3 rounded-lg sm:rounded-r-none border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg sm:rounded-l-none font-medium hover:bg-indigo-700 transition duration-150 ease-in-out"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Quick View Modal */}
            {isQuickViewOpen && quickViewProduct && (
                <QuickViewModal
                    product={quickViewProduct}
                    onClose={closeQuickView}
                    onAddToCart={() => {
                        handleAddToCart(quickViewProduct.id);
                        closeQuickView();
                    }}
                    isInCart={cartedProducts.some(item => item.productId === quickViewProduct.id)}
                    cartQuantity={cartedProducts.find(item => item.productId === quickViewProduct.id)?.quantity || 0}
                />
            )}
        </div>
    );
};

export default Home;