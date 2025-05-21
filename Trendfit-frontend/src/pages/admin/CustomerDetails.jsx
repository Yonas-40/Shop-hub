import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin,
    FiCalendar, FiShoppingCart, FiXCircle, FiEdit2,
    FiCheck, FiX, FiShield, FiTrash2, FiPlus, FiChevronRight
} from 'react-icons/fi';
import { FaTransgender, FaBirthdayCake } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import {
    fetchUserProfile,
    updateUserProfile,
    fetchUserAddresses,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    setDefaultAddress
} from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CustomerDetails = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({
        fullName: '',
        gender: '',
        phone: '',
        age: ''
    });
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        country: '',
        addressType: 'Home',
        isDefault: false
    });
    const [activeTab, setActiveTab] = useState('profile');

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [profileData, addressesData] = await Promise.all([
                fetchUserProfile(id, token),
                fetchUserAddresses(id, token)
            ]);

            setCustomer(profileData);
            setAddresses(addressesData);
            setEditData({
                fullName: profileData.fullName || '',
                phone: profileData.phone || '',
                gender: profileData.gender || '',
                age: profileData.age || ''
            });
            toast.success('Customer data loaded successfully');
        } catch (err) {
            setError('Failed to load customer details. Please try again later.');
            toast.error('Failed to load customer details');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, token]);

    const handleEditToggle = () => {
        if (editing) {
            // Reset form data when canceling edit mode
            setEditData({
                fullName: customer.fullName || '',
                phone: customer.phone || '',
                gender: customer.gender || '',
                age: customer.age || ''
            });
            setNewAddress({
                street: '',
                city: '',
                country: '',
                addressType: 'Home',
                isDefault: false
            });
            toast('Changes discarded', { icon: '⚠️' });
        }
        setEditing(!editing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        if (!editData.fullName.trim()) {
            toast.error('Full name is required');
            return;
        }

        try {
            setLoading(true);
            const toastId = toast.loading('Updating profile...');
            const updatedCustomer = await updateUserProfile(id, editData, token);
            setCustomer(updatedCustomer);
            await fetchData();
            setEditing(false);
            toast.success('Profile updated successfully', { id: toastId });
        } catch (err) {
            setError('Failed to update profile. Please try again.');
            toast.error('Failed to update profile');
            console.error('Error updating profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAddress = async (address) => {
        if (!address.street.trim() || !address.city.trim() || !address.country.trim()) {
            toast.error('Please fill all address fields');
            return;
        }

        try {
            setLoading(true);
            const toastId = toast.loading(address.id ? 'Updating address...' : 'Adding address...');

            if (address.id) {
                // Update existing address
                const updatedAddress = await updateUserAddress(
                    id,
                    address.id,
                    address,
                    token
                );
                setAddresses(prev => prev.map(a =>
                    a.id === address.id ? updatedAddress : a
                ));
                toast.success('Address updated successfully', { id: toastId });
            } else {
                // Add new address
                const addedAddress = await addUserAddress(id, address, token);
                setAddresses(prev => [...prev, addedAddress]);
                setNewAddress({
                    street: '',
                    city: '',
                    country: '',
                    addressType: 'Home',
                    isDefault: false
                });
                toast.success('Address added successfully', { id: toastId });
            }
            await fetchData();
        
        } catch (err) {
            setError('Failed to save address. Please try again.');
            toast.error('Failed to save address');
            console.error('Error saving address:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveAddress = async (addressId) => {
        try {
            setLoading(true);
            const toastId = toast.loading('Removing address...');
            await deleteUserAddress(id, addressId, token);
            setAddresses(prev => prev.filter(a => a.id !== addressId));
            toast.success('Address removed successfully', { id: toastId });
        } catch (err) {
            setError('Failed to delete address. Please try again.');
            toast.error('Failed to delete address');
            console.error('Error deleting address:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSetDefaultAddress = async (addressId) => {
        try {
            setLoading(true);
            const toastId = toast.loading('Setting default address...');
            await setDefaultAddress(id, addressId, token);
            setAddresses(prev => prev.map(addr => ({
                ...addr,
                isDefault: addr.id === addressId
            })));
            toast.success('Default address updated', { id: toastId });
        } catch (err) {
            setError('Failed to set default address. Please try again.');
            toast.error('Failed to set default address');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddressChange = (addressId, field, value) => {
        setAddresses(prev => prev.map(addr =>
            addr.id === addressId ? { ...addr, [field]: value } : addr
        ));
    };

    const handleNewAddressChange = (field, value) => {
        setNewAddress(prev => ({ ...prev, [field]: value }));
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            });
        } catch (error) {
            return 'N/A';
        }
    };

    const renderSkeletonLoader = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton width={150} height={40} />
                <Skeleton width={120} height={40} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-gray-50 rounded-md p-6">
                        <Skeleton height={30} width={200} className="mb-4" />
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((field) => (
                                <div key={field}>
                                    <Skeleton height={20} width={100} className="mb-2" />
                                    <Skeleton height={30} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 rounded-md p-6">
                <Skeleton height={30} width={200} className="mb-4" />
                <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                        <Skeleton key={item} height={80} />
                    ))}
                </div>
            </div>
        </div>
    );

    if (loading && !customer) {
        return (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden p-8">
                {renderSkeletonLoader()}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden p-8">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FiXCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <Link
                        to="/admin/customers"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <FiArrowLeft className="mr-2" /> Back to Customers
                    </Link>
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                    <FiUser className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Customer not found</h3>
                <p className="mt-1 text-sm text-gray-500">The customer you're looking for doesn't exist or may have been deleted.</p>
                <div className="mt-6">
                    <Link
                        to="/admin/customers"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <FiArrowLeft className="mr-2" /> Back to Customers
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-6 px-8 flex items-center justify-between">
                <Link
                    to="/admin/customers"
                    className="flex items-center hover:text-indigo-200 transition duration-200 group"
                >
                    <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Customers
                </Link>
                <div className="flex items-center">
                    <div className="bg-indigo-300 p-2 rounded-full">
                        <FiUser className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-semibold ml-3">Customer Details</h2>
                </div>
                <div className="flex items-center space-x-4">
                    

                    <div className="flex items-center space-x-2">
                        {editing ? (
                            <>
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={loading}
                                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 ${loading
                                        ? 'bg-indigo-400 cursor-not-allowed'
                                        : 'bg-white text-indigo-600 hover:bg-indigo-100 cursor-pointer hover:shadow-md transform hover:-translate-y-0.5'
                                        }`}
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <>
                                            <FiCheck className="h-5 w-5" />
                                            <span className="font-medium">Save</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleEditToggle}
                                    className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-transparent border-2 border-white text-white cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
                                >
                                    <FiX className="h-5 w-5" />
                                    <span className="font-medium">Cancel</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleEditToggle}
                                className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-white bg-opacity-90 cursor-pointer text-indigo-600 hover:bg-opacity-100 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <FiEdit2 className="h-5 w-5" />
                                <span className="font-medium">Edit Profile</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-8">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'orders' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'activity' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Activity
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="p-8">
                {activeTab === 'profile' && (
                    <div className="grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Basic Information */}
                            <div className="bg-gray-50 rounded-xl p-6 transition-all duration-200 hover:shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                        <FiUser className="text-indigo-500" />
                                    </div>
                                    Basic Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Full Name:</label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={editData.fullName}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                                                placeholder="Enter full name"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{customer.fullName || <span className="text-gray-400">Not provided</span>}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
                                        {editing ? (
                                            <input
                                                type="text"
                                                name="phone"
                                                value={editData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                                                placeholder="Enter phone number"
                                            />
                                        ) : (
                                            <p className="text-gray-900 flex items-center">
                                                <FiPhone className="mr-2 text-gray-400" /> {customer.phone || <span className="text-gray-400">Not provided</span>}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Age:</label>
                                        {editing ? (
                                            <input
                                                type="number"
                                                name="age"
                                                value={editData.age}
                                                onChange={handleInputChange}
                                                min="1"
                                                max="120"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                                                placeholder="Enter age"
                                            />
                                        ) : (
                                            <p className="text-gray-900 flex items-center">
                                                <FaBirthdayCake className="mr-2 text-gray-400" /> {customer.age || <span className="text-gray-400">Not provided</span>}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Gender:</label>
                                        {editing ? (
                                            <select
                                                name="gender"
                                                value={editData.gender || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                                            >
                                                <option value="">Prefer not to say</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        ) : (
                                            <p className="text-gray-900 flex items-center">
                                                <FaTransgender className="mr-2 text-gray-400" /> {customer.gender || <span className="text-gray-400">Not provided</span>}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="bg-gray-50 rounded-xl p-6 transition-all duration-200 hover:shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                        <FiMapPin className="text-indigo-500" />
                                    </div>
                                    Addresses
                                </h3>

                                <div className="space-y-4">
                                    {addresses.length > 0 ? (
                                        addresses.map((address) => (
                                            <div
                                                key={address.id}
                                                className={`p-4 rounded-lg transition-all duration-200 ${address.isDefault ? 'bg-indigo-50 border border-indigo-200' : 'bg-white border border-gray-200 hover:border-indigo-200'}`}
                                            >
                                                {address.isDefault && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-2">
                                                        Default
                                                    </span>
                                                )}
                                                <p className="font-medium text-gray-900">{address.street}</p>
                                                <p className="text-gray-600">{address.city}, {address.country}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {address.addressType === 'Home' ? '🏠 Home Address' : '🏢 Work Address'}
                                                </p>

                                                {editing && (
                                                    <div className="mt-3 flex space-x-2">
                                                        <button
                                                            onClick={() => handleSetDefaultAddress(address.id)}
                                                            disabled={address.isDefault}
                                                            className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm ${address.isDefault ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                                                        >
                                                            Set Default
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveAddress(address.id)}
                                                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm bg-red-100 text-red-700 hover:bg-red-200"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <FiMapPin className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
                                            <p className="mt-1 text-sm text-gray-500">This customer hasn't added any addresses yet.</p>
                                        </div>
                                    )}

                                    {editing && (
                                        <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg transition-all duration-200 hover:border-indigo-300">
                                            <h4 className="font-medium mb-3 text-gray-700">Add New Address</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Street"
                                                        value={newAddress.street}
                                                        onChange={(e) => handleNewAddressChange('street', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="City"
                                                        value={newAddress.city}
                                                        onChange={(e) => handleNewAddressChange('city', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Country"
                                                        value={newAddress.country}
                                                        onChange={(e) => handleNewAddressChange('country', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-sm font-bold mb-2">Address Type:</label>
                                                    <select
                                                        value={newAddress.addressType}
                                                        onChange={(e) => handleNewAddressChange('addressType', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                                                    >
                                                        <option value="Home">Home</option>
                                                        <option value="Work">Work</option>
                                                    </select>
                                                </div>
                                                <button
                                                    onClick={() => handleSaveAddress(newAddress)}
                                                    disabled={!newAddress.street || !newAddress.city || !newAddress.country}
                                                    className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!newAddress.street || !newAddress.city || !newAddress.country ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200`}
                                                >
                                                    <FiPlus className="mr-2" /> Add Address
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="bg-gray-50 rounded-xl p-6 transition-all duration-200 hover:shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                        <FiCalendar className="text-indigo-500" />
                                    </div>
                                    Account Information
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Joined On:</label>
                                        <p className="text-gray-900">{formatDate(customer.createdAt)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                                        <p className="text-gray-900 flex items-center">
                                            <FiMail className="mr-2 text-gray-400" /> {customer.email}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Account Status:</label>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Last Active:</label>
                                        <p className="text-gray-900">{customer.lastLogin ? formatDate(customer.lastLogin) : 'Unknown'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="bg-gray-50 rounded-xl p-6 transition-all duration-200 hover:shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                <FiShoppingCart className="text-indigo-500" />
                            </div>
                            Orders
                        </h3>
                        {customer.orders?.length > 0 ? (
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Order ID
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Date
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Items
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Total
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Status
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">View</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {customer.orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    #{order.id}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {formatDate(order.createdAt)}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {order.items?.length || 0} items
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    ${order.totalPrice?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <Link
                                                        to={`/admin/orders/${order.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                                                    >
                                                        View <FiChevronRight className="ml-1" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                                <p className="mt-1 text-sm text-gray-500">This customer hasn't placed any orders yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="bg-gray-50 rounded-xl p-6 transition-all duration-200 hover:shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                <FiShield className="text-indigo-500" />
                            </div>
                            Customer Activity
                        </h3>
                        <div className="space-y-6">
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Customer actions and events</p>
                                </div>
                                <div className="border-t border-gray-200">
                                    <dl>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Last Login</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {customer.lastLogin ? formatDate(customer.lastLogin) : 'Never logged in'}
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {formatDate(customer.createdAt)}
                                            </dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Total Orders</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {customer.orders?.length || 0}
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Total Spent</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                ${customer.orders?.reduce((total, order) => total + (order.totalPrice || 0), 0).toFixed(2) || '0.00'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Security</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Account security settings</p>
                                </div>
                                <div className="border-t border-gray-200">
                                    <dl>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {customer.emailVerified ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        Not Verified
                                                    </span>
                                                )}
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Two-Factor Auth</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Disabled
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDetails;