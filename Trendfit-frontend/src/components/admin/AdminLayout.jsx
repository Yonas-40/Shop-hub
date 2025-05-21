import { useState } from 'react';
import {
    FiMenu, FiSearch, FiBell, FiUser, FiHome, FiPackage,
    FiShoppingCart, FiUsers, FiBarChart2
} from 'react-icons/fi';
import { FaHouse, FaCartShopping, FaChevronDown } from "react-icons/fa6";
import { TbCategoryPlus } from "react-icons/tb";
import { GiHandTruck } from "react-icons/gi";
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


const AdminLayout = () => {
    const { token, user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const location = useLocation();
    const [showAccountOptions, setShowAccountOptions] = useState(false); // Define showAccountOptions state

    const navItems = [
        { path: '/admin', icon: FiHome, label: 'Dashboard' },
        { path: '/admin/products', icon: FiPackage, label: 'Products' },
        { path: '/admin/orders', icon: FiShoppingCart, label: 'Orders' },
        { path: '/admin/customers', icon: FiUsers, label: 'Customers' },
        { path: '/admin/categories', icon: TbCategoryPlus, label: 'Categories' },
        { path: '/admin/suppliers', icon: GiHandTruck, label: 'Suppliers' },
        { path: '/admin/profile', icon: FiUser, label: 'Profile' },
    ];
    const handleLogout = async () => {
        await logout(); // Call the logout function from your AuthContext
        setShowAccountOptions(false); // Close the account options dropdown
    };
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar - Desktop */}
            <div className={`hidden md:flex flex-col bg-white shadow-lg ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
                <div className="flex items-center justify-between p-4 shadow-sm z-10">
                    {sidebarOpen && (
                        <h1 className="text-xl font-bold text-indigo-600">ShopHub Admin</h1>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <FiMenu className="text-gray-600" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto">
                    <ul className="p-2">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center p-3 rounded-lg ${location.pathname === item.path ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}`}
                                >
                                    <item.icon className="text-lg" />
                                    {sidebarOpen && <span className="ml-3">{item.label}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Sidebar - Mobile */}
            {mobileSidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75"
                        onClick={() => setMobileSidebarOpen(false)}
                    ></div>
                    <div className="relative flex flex-col w-72 max-w-xs bg-white shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h1 className="text-xl font-bold text-indigo-600">ShopHub Admin</h1>
                            <button
                                onClick={() => setMobileSidebarOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <FiMenu className="text-gray-600" />
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto">
                            <ul className="p-2">
                                {navItems.map((item) => (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center p-3 rounded-lg ${location.pathname === item.path ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}`}
                                            onClick={() => setMobileSidebarOpen(false)}
                                        >
                                            <item.icon className="text-lg" />
                                            <span className="ml-3">{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between px-4 py-3.5">
                        <div className="flex items-center">
                            <button
                                className="p-2 mr-2 text-gray-600 rounded-lg md:hidden hover:bg-gray-100"
                                onClick={() => setMobileSidebarOpen(true)}
                            >
                                <FiMenu className="text-lg" />
                            </button>
                            <h1 className="text-xl font-bold text-gray-800">
                                {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 relative">
                                <FiBell className="text-lg" />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            {user ? (
                                <div className="relative">
                                    <button
                                        className="text-gray-500 hover:text-indigo-600 cursor-pointer flex items-center"
                                        onClick={() => setShowAccountOptions(!showAccountOptions)}
                                    >
                                        <FiUser className="text-lg" />
                                        <span className="hidden md:inline text-sm font-medium mx-1">{ user.username }</span>
                                        <FaChevronDown className="ml-1 text-xs" />
                                    </button>
                                    {showAccountOptions && (
                                        <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                            <Link
                                                to="/admin/profile"
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
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;