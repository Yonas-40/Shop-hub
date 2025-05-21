import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiMail, FiPhone, FiPackage, FiCalendar, FiSettings, FiLogOut, FiShield, FiShoppingCart, FiHeart, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { fetchUserProfile, updateUserProfile } from '../../services/api';
import { FaRegIdBadge, FaCakeCandles } from "react-icons/fa6";

const AdminProfile = () => {
    const { token, user, logout } = useAuth();
    const [adminDetails, setAdminDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({
        fullName: '',
        email: '',
        phone: '',
        age: ''
    });

    const fetchAdminData = async () => {
        try {
            const response = await fetchUserProfile(user.id);
            console.log('fetched user data: ', response);
            setAdminDetails(response);
            setEditData({
                fullName: response.fullName || '',
                email: response.email || '',
                phone: response.phone || '',
                age: response.age || ''
            });
        } catch (err) {
            setError('Failed to fetch admin details.');
            console.error('Error fetching admin details:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAdminData();
        }
    }, [user?.id]);


    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            // Call your API to update the admin details
            const updatedAdmin = await updateUserProfile(user.id, editData);
            setAdminDetails(updatedAdmin);
            await fetchAdminData();
            setEditing(false);
        } catch (err) {
            setError('Failed to update profile.');
            console.error('Error updating admin details:', err);
        }
    };

    const handleCancel = () => {
        setEditData({
            fullName: adminDetails.fullName || '',
            email: adminDetails.email || '',
            phone: adminDetails.phone || ''
        });
        setEditing(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        );
    }

    if (!adminDetails) {
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                <p className="font-bold">Warning</p>
                <p>Could not load admin profile information.</p>
            </div>
        );
    }

    const formattedDate = new Date(adminDetails.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="">
            <div className="max-w-4xl mx-auto">
                
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    {/* Profile Header with Edit Button */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                                    <FiUser className="h-8 w-8 text-indigo-600" />
                                </div>
                                <div className="ml-4">
                                    {editing ? (
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={editData.fullName}
                                            onChange={handleInputChange}
                                            className="bg-opacity-20 border-b border-white text-2xl font-bold w-full"
                                        />
                                    ) : (
                                        <h2 className="text-2xl font-bold">{adminDetails.fullName || 'Admin'}</h2>
                                    )}
                                    {editing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editData.email}
                                            onChange={handleInputChange}
                                            className="bg-opacity-20 border-b border-white w-full mt-1"
                                        />
                                    ) : (
                                        <p className="text-blue-100">{adminDetails.email}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                {editing ? (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleSave}
                                            className="p-2 bg-green-100 rounded-full hover:bg-green-300 cursor-pointer transition"
                                            title="Save Changes"
                                        >
                                            <FiCheck className="h-5 w-5 text-green-600 hover:text-green-900 transition" />
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="p-2 bg-red-100 rounded-full hover:bg-red-300 cursor-pointer transition"
                                            title="Cancel"
                                        >
                                            <FiX className="h-5 w-5 text-red-600 hover:text-red-900 transition" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleEditToggle}
                                        className="p-2 bg-blue-50 rounded-full hover:bg-blue-200 cursor-pointer transition"
                                        title="Edit Profile"
                                    >
                                        <FiEdit2 className="h-5 w-5 text-blue-600 hover:text-blue-900 transition" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                        {/* Personal Information */}
                        <div className="md:col-span-2">
                            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <FiUser className="mr-2 text-blue-600" />
                                    Personal Information
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <span className="text-gray-500 w-32 flex-shrink-0">User ID</span>
                                        <FaRegIdBadge className="mr-2 text-blue-600" />
                                        <span className="text-gray-800 font-medium">{user?.id}</span>
                                    </div>

                                    <div className="flex items-start">
                                        <span className="text-gray-500 w-32 flex-shrink-0">Phone</span>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="phone"
                                                value={editData.phone}
                                                onChange={handleInputChange}
                                                className="border-b border-gray-300 px-2 py-1 w-full focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            <span className="text-gray-800 font-medium flex items-center">
                                                <FiPhone className="mr-2 text-blue-600" />
                                                {adminDetails.phone || 'Not provided'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 w-32 flex-shrink-0">Age</span>
                                        {editing ? (
                                            <input
                                                type="number"
                                                name="age"
                                                value={editData.age}
                                                onChange={handleInputChange}
                                                className="border-b border-gray-300 px-2 py-1 w-full focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            <span className="text-gray-800 font-medium flex items-center">
                                                <FaCakeCandles className="mr-2 text-blue-600" />
                                                {adminDetails.age || 'Not provided'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 w-32 flex-shrink-0">Member Since</span>
                                        <span className="text-gray-800 font-medium flex items-center">
                                            <FiCalendar className="mr-2 text-blue-600" />
                                            {formattedDate}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Statistics */}
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                            <FiShield className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-500">Admin Level</p>
                                            <p className="text-lg font-semibold">Super Admin</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                                            <FiShoppingCart className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-500">Cart Items</p>
                                            <p className="text-lg font-semibold">{adminDetails.cartItems?.length || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                            <FiHeart className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-500">Wishlist</p>
                                            <p className="text-lg font-semibold">{adminDetails.wishlistItems?.length || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-full bg-red-100 text-red-600">
                                            <FiPackage className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-500">Orders</p>
                                            <p className="text-lg font-semibold">{adminDetails.orders?.length || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Admin Actions */}
                        <div>
                            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <FiShield className="mr-2 text-blue-600" />
                                    Admin Actions
                                </h3>
                                <div className="space-y-3">
                                    <button className="block w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition duration-150">
                                        Manage Users
                                    </button>
                                    <button className="block w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition duration-150">
                                        Manage Products
                                    </button>
                                    <button className="block w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition duration-150">
                                        View Orders
                                    </button>
                                    <button className="block w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition duration-150">
                                        System Settings
                                    </button>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-6 bg-gray-50 rounded-lg p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <FiSettings className="mr-2 text-blue-600" />
                                    Quick Actions
                                </h3>
                                <div className="space-y-4">
                                    <button
                                        onClick={editing ? handleSave : handleEditToggle}
                                        className={`flex items-center justify-center w-full px-4 py-2 rounded-md transition duration-150 ${editing
                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {editing ? (
                                            <>
                                                <FiCheck className="mr-2" />
                                                Save Changes
                                            </>
                                        ) : (
                                            <>
                                                <FiEdit2 className="mr-2" />
                                                Edit Profile
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={logout}
                                        className="flex items-center justify-center w-full px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition duration-150"
                                    >
                                        <FiLogOut className="mr-2" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;