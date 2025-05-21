import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaShoppingCart, FaSearch, FaBorderAll, FaLaptop, FaTshirt, FaSpa, FaRunning } from 'react-icons/fa';
import { FaHouse, FaCartShopping, FaChevronDown } from "react-icons/fa6";
import cartService from '../services/cartService';
import categoryService from '../services/categoryService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
const Navbar = () => {
    const { token, user, logout } = useAuth();
    const { cartCount } = useCart();
    const [activeCategory, setActiveCategory] = useState('All');
    const [categories, setCategories] = useState(null);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const currentPath = location.pathname;
    const [showCategories, setShowCategories] = useState(false);
    const [showAccountOptions, setShowAccountOptions] = useState(false); // Define showAccountOptions state
    const [cartLoading, setCartLoading] = useState(false);


    const fetchCategories = async () => {
        if (token && user?.id) {
            setCartLoading(true);
            try {
                const categoryData = await categoryService.getAllCategories(token);
                console.log('categories: ', categoryData);
                setCategories(categoryData); // Update the cartItems state
            } catch (err) {
                console.error("Error fetching cart items:", err);
            } finally {
                setCartLoading(false);
            }
        }
    };
    // You might want to fetch cart items when the component mounts or when the user logs in
    useEffect(() => {
        fetchCategories();
    }, [token, user?.id]); // Re-fetch if token or userId changes

    const handleLogout = async () => {
        await logout(); // Call the logout function from your AuthContext
        setShowAccountOptions(false); // Close the account options dropdown
    };


    const navItems = ['Home', 'Shop', 'Orders', 'About'];

    return (
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <span className="text-indigo-600 text-2xl font-bold">ShopHub</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8 relative">
                        {navItems.map((item) => (
                            <Link
                                key={item}
                                to={`/${item.toLowerCase()}`}
                                className={`text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium cursor-pointer ${currentPath === `/${item.toLowerCase()}` ? 'text-indigo-600 border-b-2 border-indigo-600' : ''
                                    }`}
                            >
                                {item}
                            </Link>
                        ))}

                        {/* Categories Dropdown */}
                        <div className="relative">
                            <button
                                className={`text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium cursor-pointer flex items-center ${currentPath === '/categories' ? 'text-indigo-600 border-b-2 border-indigo-600' : ''
                                    }`}
                                onClick={() => setShowCategories(!showCategories)}
                            >
                                Categories
                                <FaChevronDown className="ml-1 text-xs" />
                            </button>
                            {showCategories && (
                                <div
                                    className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                                    onMouseLeave={() => setShowCategories(false)}
                                >
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            to={`/categories/${category.name || category.id}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between"
                                            onClick={() => setShowCategories(false)}
                                        >
                                            <span>{category.name}</span>
                                            <span className="text-gray-400 text-xs">({category.products.length})</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>
                    {/* Search, Account, Cart */}
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <FaSearch />
                            </div>
                        </div>
                        <div className="relative">
                            {user ? (
                                // User is logged in, show Profile/Logout options
                                <div className="relative">
                                    <button
                                        className="text-gray-500 hover:text-indigo-600 cursor-pointer flex items-center"
                                        onClick={() => setShowAccountOptions(!showAccountOptions)}
                                    >
                                        <FaUser className="text-lg" />
                                        <FaChevronDown className="ml-1 text-xs" />
                                    </button>

                                    {showAccountOptions && (
                                        <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                                onClick={() => setShowAccountOptions(false)}
                                            >
                                                Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // No user logged in, show Login link
                                <Link to="/login" className="text-gray-500 hover:text-indigo-600 cursor-pointer">
                                    <FaUser className="text-lg" />
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <Link to="/carts" className="text-gray-500 hover:text-indigo-600 cursor-pointer text-lg">
                                <FaCartShopping />
                            </Link>
                            {cartCount > 0 && (
                                <span className="absolute -top-3 -right-3 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden text-gray-500 hover:text-indigo-600 cursor-pointer"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                        >
                            {showMobileMenu ? (
                                <FaTimes className="text-xl" />
                            ) : (
                                <FaBars className="text-xl" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {showMobileMenu && (
                <div className="md:hidden bg-white shadow-lg py-2">
                    {['Home', 'Shop', 'Categories', 'Deals', 'About'].map((item) => (
                        <Link
                            key={item}
                            to={`/${item.toLowerCase()}`}
                            className="block px-4 py-2 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
                        >
                            {item}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
};

export default Navbar;
