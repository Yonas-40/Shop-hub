// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaUser, FaShoppingCart, FaSearch, FaLaptop, FaTshirt, FaSpa, FaRunning } from 'react-icons/fa';
import { FaChevronRight, FaChevronDown, FaChevronLeft, FaPlus, FaStar, FaHouse, FaArrowRight, FaCheck, FaFilter, FaBorderAll, FaList } from "react-icons/fa6";
import productService from '../services/productService'; // Assuming this path
// import categoryService from '../../services/categoryService'; // If you want dynamic categories
import { useAuth } from '../contexts/AuthContext';
const Home = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [cartCount, setCartCount] = useState(2);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    // Initialize charts after component mounts

    useEffect(() => {
        const fetchHomePageData = async () => {
            setLoading(true);
            setError(null);
            try {
                const featuredData = await productService.getFeaturedProducts(token); // Implement this in your productService
                console.log('featured data: ', featuredData);
                setFeaturedProducts(featuredData);

                const newArrivalsData = await productService.getNewArrivals(token);
                console.log('newArrivals: ', newArrivalsData);

                setNewArrivals(newArrivalsData);
            } catch (err) {
                console.error('Error fetching home page data:', err);
                setError(err.message || 'Failed to load products.');
            } finally {
                setLoading(false);
            }
        };

        fetchHomePageData();
    }, [token]);

    const categories = [
        { id: 1, name: 'All', icon: <FaBorderAll className="text-indigo-600 text-xl" /> },
        { id: 2, name: 'Electronics', icon: <FaLaptop className="text-indigo-600 text-xl" /> },
        { id: 3, name: 'Fashion', icon: <FaTshirt className="text-indigo-600 text-xl" /> },
        { id: 4, name: 'Home', icon: <FaHouse className="text-indigo-600 text-xl" /> },
        { id: 5, name: 'Beauty', icon: <FaSpa className="text-indigo-600 text-xl" /> },
        { id: 6, name: 'Sports', icon: <FaRunning className="text-indigo-600 text-xl" /> }
    ];


    //const featuredProducts = [
    //    {
    //        id: 1,
    //        name: 'Premium Wireless Headphones',
    //        price: 299.99,
    //        discount: 15,
    //        rating: 4.8,
    //        imageUrl: 'https://readdy.ai/api/search-image?query=Premium%20wireless%20headphones%20with%20sleek%20modern%20design%2C%20noise%20cancellation%20technology%2C%20floating%20on%20a%20minimalist%20light%20gray%20background%20with%20subtle%20shadow%2C%20product%20photography%20with%20soft%20lighting%20and%20high%20detail&width=400&height=400&seq=1&orientation=squarish'
    //    },
    //    {
    //        id: 2,
    //        name: 'Smart Watch Series 5',
    //        price: 249.99,
    //        discount: 0,
    //        rating: 4.6,
    //        imageUrl: 'https://readdy.ai/api/search-image?query=Modern%20smartwatch%20with%20sleek%20design%2C%20bright%20display%20showing%20fitness%20metrics%2C%20on%20minimalist%20light%20gray%20background%20with%20subtle%20shadow%2C%20product%20photography%20with%20soft%20lighting%20and%20high%20detail&width=400&height=400&seq=2&orientation=squarish'
    //    },
    //    {
    //        id: 3,
    //        name: 'Ultra-Slim Laptop Pro',
    //        price: 1299.99,
    //        discount: 10,
    //        rating: 4.9,
    //        imageUrl: 'https://readdy.ai/api/search-image?query=Ultra-slim%20modern%20laptop%20with%20aluminum%20finish%2C%20open%20display%20showing%20vibrant%20screen%2C%20positioned%20on%20minimalist%20light%20gray%20background%20with%20subtle%20shadow%2C%20product%20photography%20with%20soft%20lighting%20and%20high%20detail&width=400&height=400&seq=3&orientation=squarish'
    //    },
    //    {
    //        id: 4,
    //        name: 'Professional Camera Kit',
    //        price: 899.99,
    //        discount: 5,
    //        rating: 4.7,
    //        imageUrl: 'https://readdy.ai/api/search-image?query=Professional%20DSLR%20camera%20with%20attached%20zoom%20lens%2C%20detailed%20texture%20and%20controls%20visible%2C%20positioned%20on%20minimalist%20light%20gray%20background%20with%20subtle%20shadow%2C%20product%20photography%20with%20soft%20lighting%20and%20high%20detail&width=400&height=400&seq=4&orientation=squarish'
    //    }
    //];

    //const newArrivals = [
    //    {
    //        id: 5,
    //        name: 'Smart Home Speaker',
    //        price: 129.99,
    //        category: 'Electronics',
    //        imageUrl: 'https://readdy.ai/api/search-image?query=Modern%20cylindrical%20smart%20home%20speaker%20with%20fabric%20exterior%2C%20subtle%20LED%20indicators%2C%20positioned%20on%20minimalist%20light%20gray%20background%20with%20subtle%20shadow%2C%20product%20photography%20with%20soft%20lighting%20and%20high%20detail&width=400&height=400&seq=5&orientation=squarish'
    //    },
    //    {
    //        id: 6,
    //        name: 'Fitness Tracker Band',
    //        price: 79.99,
    //        category: 'Electronics',
    //        imageUrl: 'https://readdy.ai/api/search-image?query=Sleek%20fitness%20tracker%20band%20with%20colorful%20display%20showing%20health%20metrics%2C%20flexible%20silicone%20strap%2C%20positioned%20on%20minimalist%20light%20gray%20background%20with%20subtle%20shadow%2C%20product%20photography%20with%20soft%20lighting%20and%20high%20detail&width=400&height=400&seq=6&orientation=squarish'
    //    },
    //    {
    //        id: 7,
    //        name: 'Designer Sunglasses',
    //        price: 159.99,
    //        category: 'Fashion',
    //        imageUrl: 'https://readdy.ai/api/search-image?query=Elegant%20designer%20sunglasses%20with%20metal%20frame%20and%20gradient%20lenses%2C%20sophisticated%20design%20details%20visible%2C%20positioned%20on%20minimalist%20light%20gray%20background%20with%20subtle%20shadow%2C%20product%20photography%20with%20soft%20lighting%20and%20high%20detail&width=400&height=400&seq=7&orientation=squarish'
    //    },
    //    {
    //        id: 8,
    //        name: 'Wireless Charging Pad',
    //        price: 49.99,
    //        category: 'Electronics',
    //        imageUrl: 'https://readdy.ai/api/search-image?query=Circular%20wireless%20charging%20pad%20with%20minimalist%20design%2C%20subtle%20LED%20indicator%2C%20positioned%20on%20minimalist%20light%20gray%20background%20with%20subtle%20shadow%2C%20product%20photography%20with%20soft%20lighting%20and%20high%20detail&width=400&height=400&seq=8&orientation=squarish'
    //    }
    //];

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
                                Discover the latest trends and exclusive deals on our premium products. Shop now and enjoy free shipping on orders over $50.
                            </p>
                            <div className="mt-8 flex space-x-4">
                                <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-medium shadow-md transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer">
                                    Shop Now
                                </button>
                                <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer">
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
                                    onClick={() => setActiveCategory(category.name)}
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
                            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center cursor-pointer">
                                View All <FaArrowRight className="ml-2" />
                            </a>
                        </div>

                        {loading ? (
                            <div className="text-center py-8">Loading featured products...</div>
                        ) : error ? (
                            <div className="text-red-500 py-8">{error}</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {featuredProducts.map((product) => (
                                    <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition duration-150 cursor-pointer">
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={product.imageUrl} // Assuming your backend returns imageUrl
                                                alt={product.name}
                                                className="w-full h-full object-cover object-top transition duration-300 hover:scale-105"
                                            />
                                            {product.discount > 0 && (
                                                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                    -{product.discount}%
                                                </div>
                                            )}
                                            <button className="absolute bottom-4 right-4 bg-indigo-600 text-white p-2 rounded shadow-md hover:bg-indigo-700 transition duration-150 !rounded-button whitespace-nowrap">
                                                <FaShoppingCart />
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
                                                <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium !rounded-button whitespace-nowrap">
                                                    Quick View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                        <p className="mt-4 text-lg leading-6 text-indigo-100">
                            Sign up for our newsletter and get 10% off your first order.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <div className="inline-flex rounded-md shadow">
                                <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-medium transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer">
                                    Sign up now
                                </button>
                            </div>
                            <div className="ml-3 inline-flex">
                                <button className="bg-indigo-700 text-white hover:bg-indigo-800 px-6 py-3 rounded-lg font-medium transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer">
                                    Learn more
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

              
                {/* New Arrivals */}
                <section className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
                            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center cursor-pointer">
                                View All <i className="fas fa-arrow-right ml-2"></i>
                            </a>
                        </div>

                        {loading ? (
                            <div className="text-center py-8">Loading new arrivals...</div>
                        ) : error ? (
                            <div className="text-red-500 py-8">{error}</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {newArrivals.map((product) => (
                                    <div key={product.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition duration-150 cursor-pointer">
                                        <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                                            <img
                                                src={product.imageUrl} // Assuming your backend returns imageUrl
                                                alt={product.name}
                                                className="w-full h-full object-cover object-top transition duration-300 hover:scale-105"
                                            />
                                        </div>
                                        <div>
                                            <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                                                {product.categoryName} {/* Assuming your backend returns category */}
                                            </span>
                                            <h3 className="mt-2 text-lg font-medium text-gray-900">{product.name}</h3>
                                            <div className="mt-1 flex justify-between items-center">
                                                <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                                <button className="bg-indigo-600 text-white p-2 rounded-full shadow-sm hover:bg-indigo-700 transition duration-150 !rounded-button whitespace-nowrap">
                                                    <FaPlus />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                                <p className="text-gray-600 mb-6">
                                    Stay updated with our latest products, exclusive offers, and fashion tips. Subscribe now and get 10% off your first order.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-grow px-4 py-3 rounded-lg sm:rounded-r-none border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    />
                                    <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg sm:rounded-l-none font-medium hover:bg-indigo-700 transition duration-150 ease-in-out !rounded-button whitespace-nowrap cursor-pointer">
                                        Subscribe
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-4">
                                    By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>


            </main>

            {/* Footer */}
        </div>
    );
};

export default Home;

