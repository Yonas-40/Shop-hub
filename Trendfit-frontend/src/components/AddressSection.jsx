import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaEdit, FaTrash, FaCheck, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {
    fetchUserAddresses,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    setDefaultAddress
} from '../services/api';

export const AddressSection = ({ userId, addresses: initialAddresses }) => {
    const [addresses, setAddresses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        country: '',
        postalCode: '',
        addressType: 'Home',
        recipientName: '',
        phoneNumber: ''
    });
    const [error, setError] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    useEffect(() => {
        const loadAddresses = async () => {
            try {
                const data = await fetchUserAddresses(userId);
                setAddresses(data);
            } catch (err) {
                setError('Failed to load addresses');
                console.error(err);
            }
        };

        if (userId) {
            loadAddresses();
        }
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddAddress = async () => {
        try {
            const newAddress = await addUserAddress(userId, formData);
            setAddresses([...addresses, newAddress]);
            setIsAdding(false);
            resetForm();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditAddress = (address) => {
        setEditingId(address.id);
        setFormData({
            street: address.street,
            city: address.city,
            country: address.country,
            postalCode: address.postalCode,
            addressType: address.addressType,
            recipientName: address.recipientName,
            phoneNumber: address.phoneNumber
        });
    };

    const handleUpdateAddress = async () => {
        try {
            const updatedAddress = await updateUserAddress(userId, editingId, formData);
            setAddresses(addresses.map(addr =>
                addr.id === editingId ? updatedAddress : addr
            ));
            cancelEdit();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            await setDefaultAddress(userId, addressId);
            setAddresses(addresses.map(addr => ({
                ...addr,
                isDefault: addr.id === addressId
            })));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            await deleteUserAddress(userId, addressId);
            setAddresses(addresses.filter(addr => addr.id !== addressId));
            setConfirmDeleteId(null); // Close confirmation dialog
        } catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setFormData({
            street: '',
            city: '',
            country: '',
            postalCode: '',
            addressType: 'Home',
            recipientName: '',
            phoneNumber: ''
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        resetForm();
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg p-6"
        >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Shipping Addresses</h3>

            <div className="flex justify-between items-center mb-4">
                <div>
                    {!isAdding && !editingId && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-full shadow-md mr-3"
                        >
                            <FaEdit className="mr-2" /> {isEditing ? 'Cancel' : 'Edit'}
                        </motion.button>
                    )}
                </div>
                {!isAdding && !editingId && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAdding(true)}
                        className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-full shadow-md"
                    >
                        <FaPlus className="mr-2" /> Add Address
                    </motion.button>
                )}
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {(isAdding || editingId) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-50 p-6 rounded-lg mb-6"
                >
                    <h3 className="font-medium text-lg mb-4">
                        {editingId ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Street</label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Address Type</label>
                            <select
                                name="addressType"
                                value={formData.addressType}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Recipient Name</label>
                            <input
                                type="text"
                                name="recipientName"
                                value={formData.recipientName}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={editingId ? cancelEdit : () => setIsAdding(false)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-full shadow-md"
                        >
                            <FaTimes className="mr-2" /> Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={editingId ? handleUpdateAddress : handleAddAddress}
                            className="px-4 py-2 bg-green-600 text-white rounded-full shadow-md"
                        >
                            <FaSave className="mr-2" /> {editingId ? 'Update' : 'Save'} Address
                        </motion.button>
                    </div>
                </motion.div>
            )}

            <div className="space-y-4">
                {addresses.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No addresses saved yet</p>
                ) : (
                    addresses.map((address) => (
                        <motion.div
                            key={address.id}
                            whileHover={{ scale: 1.01 }}
                            className={`border rounded-lg p-6 ${address.isDefault ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                        >
                            <div className="flex items-start">
                                <FaMapMarkerAlt className={`mt-1 mr-4 text-xl ${address.isDefault ? 'text-indigo-500' : 'text-gray-400'}`} />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-lg">
                                                {address.recipientName || 'No name specified'}
                                                {address.isDefault && (
                                                    <span className="ml-3 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                                                        Default
                                                    </span>
                                                )}
                                            </h4>
                                            <p className="text-gray-700 mt-2">{address.street}</p>
                                            <p className="text-gray-700">{`${address.city}, ${address.country} ${address.postalCode}`}</p>
                                            {address.phoneNumber && (
                                                <p className="text-gray-700 mt-2">
                                                    <span className="font-medium">Phone:</span> {address.phoneNumber}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {address.addressType}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {(isEditing || editingId === address.id) && (
                                <div className="flex justify-end space-x-3 mt-4">
                                    {!address.isDefault && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleSetDefault(address.id)}
                                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm shadow"
                                        >
                                            Set as Default
                                        </motion.button>
                                    )}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleEditAddress(address)}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm shadow"
                                    >
                                        <FaEdit />
                                    </motion.button>
                                    {confirmDeleteId === address.id ? (
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Are you sure?</span>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDeleteAddress(address.id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded-full text-sm shadow"
                                            >
                                                Yes
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setConfirmDeleteId(null)}
                                                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm shadow"
                                            >
                                                No
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setConfirmDeleteId(address.id)}
                                            className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm shadow"
                                        >
                                            <FaTrash />
                                        </motion.button>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};