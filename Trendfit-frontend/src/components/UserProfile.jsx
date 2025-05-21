import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone,
    FaCreditCard, FaShoppingBag, FaHistory, FaHeart,
    FaEdit, FaSave, FaTimes, FaLock, FaBirthdayCake
} from 'react-icons/fa';
import {
    fetchUserProfile,
    updateUserProfile
} from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { AddressSection } from './AddressSection';
import { PaymentMethodsSection } from './PaymentMethodSection';
import { WishlistSection } from './WishlistSection';

const UserProfile = () => {
    const { user, loading, updateProfile } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [activeTab, setActiveTab] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            const fetchProfileDetails = async () => {
                try {
                    // Replace with actual API call
                    const response = await fetchUserProfile(user.id);
                    console.log('profile-data: ', response);
                    setProfileData(response);
                    setEditFormData(response);
                } catch (err) {
                    setError('Failed to load profile data');
                    console.error('Error:', err);
                }
            };

            fetchProfileDetails();
        }
    }, [user]);

    const handleEditClick = () => setIsEditing(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveClick = async () => {
        try {
            console.log('sending data: ', user.id, editFormData);
            await updateUserProfile(user.id, editFormData);
            setProfileData(editFormData);
            setIsEditing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditFormData(profileData);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-50 to-gray-100">
                <motion.div
                    className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-purple-50 to-gray-100">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center p-8 max-w-md"
                >
                    <h1 className="text-4xl font-bold mb-6">Access Denied</h1>
                    <p className="text-xl mb-8">You need to be logged in to view this page</p>
                    <Link
                        to="/login"
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full text-lg font-semibold text-white transition-all duration-300 inline-block"
                    >
                        Login Now
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-gray-100 pt-12 pb-12 px-4 sm:px-6 lg:px-8">
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50"
                    >
                        Profile updated successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-6xl mx-auto"
            >
                {/* Profile Header */}
                <div className="bg-white rounded-t-2xl shadow-lg overflow-hidden">
                    <div className="relative h-48 bg-gradient-to-r from-purple-400 to-indigo-500">
                        <div className="absolute -bottom-16 left-8">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative h-32 w-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden"
                            >
                                <img
                                    src={profileData?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <FaEdit className="text-white text-xl" />
                                    </div>
                                )}
                            </motion.div>
                        </div>
                        <div className="absolute right-6 bottom-6">
                            {isEditing ? (
                                <div className="flex space-x-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSaveClick}
                                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-full shadow-md"
                                    >
                                        <FaSave className="mr-2" /> Save
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCancelEdit}
                                        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-full shadow-md"
                                    >
                                        <FaTimes className="mr-2" /> Cancel
                                    </motion.button>
                                </div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleEditClick}
                                    className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-full shadow-md"
                                >
                                    <FaEdit className="mr-2" /> Edit Profile
                                </motion.button>
                            )}
                        </div>
                    </div>

                    <div className="pt-20 px-8 pb-8">
                        <div className="flex flex-col md:flex-row md:justify-between">
                            <div className="mb-6 md:mb-0">
                                <motion.h1
                                    className="text-3xl font-bold text-gray-800"
                                    whileHover={{ x: 5 }}
                                >
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={editFormData.fullName || ''}
                                            onChange={handleInputChange}
                                            className="border-b-2 border-indigo-300 focus:border-indigo-500 outline-none bg-transparent w-full max-w-xs"
                                        />
                                    ) : (
                                        profileData?.fullName
                                    )}
                                </motion.h1>
                                <p className="text-gray-600 mt-3">
                                    Member since {new Date(profileData?.memberSince).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                </p>
                            </div>

                            <div className="flex space-x-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-800">{profileData?.orders?.length || 0}</div>
                                    <div className="text-gray-500">Orders</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-800">{profileData?.wishlist?.length || 0}</div>
                                    <div className="text-gray-500">Wishlist</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-800">{profileData?.cartItems?.length || 0}</div>
                                    <div className="text-gray-500">Cart Items</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Customer Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Contact Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <FaEnvelope className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <div className="text-sm text-gray-500">Email</div>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={editFormData.email || ''}
                                                onChange={handleInputChange}
                                                className="border-b-2 border-indigo-300 focus:border-indigo-500 outline-none bg-transparent w-full"
                                            />
                                        ) : (
                                            <div className="text-gray-800">{profileData?.email}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FaPhone className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <div className="text-sm text-gray-500">Phone</div>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={editFormData.phone || ''}
                                                onChange={handleInputChange}
                                                className="border-b-2 border-indigo-300 focus:border-indigo-500 outline-none bg-transparent w-full"
                                            />
                                        ) : (
                                            <div className="text-gray-800">{profileData?.phone}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FaBirthdayCake className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <div className="text-sm text-gray-500">Age</div>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                name="age"
                                                value={editFormData.age || ''}
                                                onChange={handleInputChange}
                                                className="border-b-2 border-indigo-300 focus:border-indigo-500 outline-none bg-transparent w-20"
                                                min="13"
                                                max="120"
                                            />
                                        ) : (
                                            <div className="text-gray-800">{profileData?.age}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Address Card - Now uses the AddressSection component */}
                        <AddressSection
                            userId={user.id}
                            addresses={profileData?.addresses || []}
                            isEditing={isEditing}
                            editFormData={editFormData}
                            onInputChange={handleInputChange}
                        />

                        {/* Payment Card - Now uses the PaymentMethodsSection component */}
                        <PaymentMethodsSection
                            userId={user.id}
                            paymentMethods={profileData?.paymentMethods || []}
                        />
                    </div>

                    {/* Right Column - Tabs Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
                                <TabList className="flex border-b border-gray-200">
                                    <Tab className="px-6 py-3 font-medium text-gray-600 hover:text-indigo-600 focus:outline-none">
                                        <motion.div whileHover={{ scale: 1.05 }}>Orders</motion.div>
                                    </Tab>
                                    <Tab className="px-6 py-3 font-medium text-gray-600 hover:text-indigo-600 focus:outline-none">
                                        <motion.div whileHover={{ scale: 1.05 }}>Wishlist</motion.div>
                                    </Tab>
                                    <Tab className="px-6 py-3 font-medium text-gray-600 hover:text-indigo-600 focus:outline-none">
                                        <motion.div whileHover={{ scale: 1.05 }}>Shopping Cart</motion.div>
                                    </Tab>
                                </TabList>

                                <TabPanel>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Order History</h3>
                                        <div className="space-y-6">
                                            {profileData?.orders?.map((order) => (
                                                <motion.div
                                                    key={order.id}
                                                    whileHover={{ x: 5 }}
                                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4"
                                                >
                                                    <div>
                                                        <h4 className="font-medium text-gray-800">Order #{order.id}</h4>
                                                        <p className="text-gray-500 text-sm mt-1">
                                                            {new Date(order.date).toLocaleDateString()} • {order.items} item{order.items > 1 ? 's' : ''} • ${order.total.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Delivered'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {order.status}
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {(!profileData?.orders || profileData.orders.length === 0) && (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-500">You haven't placed any orders yet</p>
                                                    <Link
                                                        to="/products"
                                                        className="mt-4 inline-block px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                                                    >
                                                        Start Shopping
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <WishlistSection
                                        userId={user.id}
                                        items={profileData?.wishlistItems || []}
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Shopping Cart</h3>
                                        <div className="text-center py-12">
                                            <FaShoppingBag className="mx-auto text-gray-300 text-5xl mb-4" />
                                            <p className="text-gray-500">Your cart is empty</p>
                                            <Link
                                                to="/products"
                                                className="mt-4 inline-block px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                                            >
                                                Continue Shopping
                                            </Link>
                                        </div>
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UserProfile;