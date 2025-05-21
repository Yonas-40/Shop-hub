import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaTrash, FaPlus, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {
    fetchUserPaymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod
} from '../services/api';

export const PaymentMethodsSection = ({ userId, paymentMethods: initialMethods }) => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        cardType: 'Visa',
        cardNumber: '',
        expirationDate: '',
        cardHolderName: '',
        securityCode: ''
    });
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const loadPaymentMethods = async () => {
            try {
                const data = await fetchUserPaymentMethods(userId);
                setPaymentMethods(data);
            } catch (err) {
                setError('Failed to load payment methods');
                console.error(err);
            }
        };

        if (userId) {
            loadPaymentMethods();
        }
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddPaymentMethod = async () => {
        try {
            // Extract last 4 digits for display
            const lastFourDigits = formData.cardNumber.slice(-4);

            const newMethod = await addPaymentMethod(userId, {
                ...formData,
                lastFourDigits,
                expirationDate: new Date(formData.expirationDate)
            });

            setPaymentMethods([...paymentMethods, newMethod]);
            setIsAdding(false);
            setFormData({
                cardType: 'Visa',
                cardNumber: '',
                expirationDate: '',
                cardHolderName: '',
                securityCode: ''
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSetDefault = async (methodId) => {
        try {
            await setDefaultPaymentMethod(userId, methodId);
            setPaymentMethods(paymentMethods.map(method => ({
                ...method,
                isDefault: method.id === methodId
            })));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteMethod = async (methodId) => {
        try {
            await deletePaymentMethod(userId, methodId);
            setPaymentMethods(paymentMethods.filter(method => method.id !== methodId));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg p-6"
        >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Methods</h3>

            <div className="flex justify-between items-center mb-4">
                <div>
                    {!isAdding && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-full shadow-md mr-3"
                        >
                            {isEditing ? 'Done' : 'Manage'}
                        </motion.button>
                    )}
                </div>
                {!isAdding && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAdding(true)}
                        className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-full shadow-md"
                    >
                        <FaPlus className="mr-2" /> Add Payment Method
                    </motion.button>
                )}
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {isAdding && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-50 p-6 rounded-lg mb-6"
                >
                    <h3 className="font-medium text-lg mb-4">Add New Payment Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Card Type</label>
                            <select
                                name="cardType"
                                value={formData.cardType}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="Visa">Visa</option>
                                <option value="MasterCard">MasterCard</option>
                                <option value="Amex">American Express</option>
                                <option value="Klarna">Klarna</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="1234 5678 9012 3456"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Expiration Date</label>
                            <input
                                type="month"
                                name="expirationDate"
                                value={formData.expirationDate}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Cardholder Name</label>
                            <input
                                type="text"
                                name="cardHolderName"
                                value={formData.cardHolderName}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Security Code</label>
                            <input
                                type="text"
                                name="securityCode"
                                value={formData.securityCode}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="CVC"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsAdding(false)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-full shadow-md"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddPaymentMethod}
                            className="px-4 py-2 bg-green-600 text-white rounded-full shadow-md"
                        >
                            Add Payment Method
                        </motion.button>
                    </div>
                </motion.div>
            )}

            <div className="space-y-4">
                {paymentMethods.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No payment methods saved yet</p>
                ) : (
                    paymentMethods.map((method) => (
                        <motion.div
                            key={method.id}
                            whileHover={{ scale: 1.01 }}
                            className={`border rounded-lg p-6 ${method.isDefault ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                        >
                            <div className="flex items-center">
                                <div className="w-12 h-8 rounded-md mr-4 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={
                                            method.cardType === 'Visa'
                                                ? "https://cdn-icons-png.flaticon.com/128/5968/5968299.png" // Visa logo
                                                : method.cardType === 'MasterCard'
                                                    ? "https://cdn-icons-png.flaticon.com/128/16174/16174561.png" // MasterCard logo (find a similar one on Flaticon)
                                                    : method.cardType === 'Amex'
                                                        ? "https://cdn-icons-png.flaticon.com/128/179/179431.png" // Amex logo (find a similar one on Flaticon)
                                                        : "https://docs.klarna.com/static/assets/Marketing%20Badge%20With%20Clear%20Space.png" // Klarna logo (find a similar one on Flaticon)
                                        }
                                        alt={`${method.cardType} Card`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-medium text-lg">
                                            {method.cardType} ending in {method.lastFourDigits}
                                            {method.isDefault && (
                                                <span className="ml-3 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                                                    Default
                                                </span>
                                            )}
                                        </h4>
                                        <span className="text-sm text-gray-500">
                                            Expires {new Date(method.expirationDate).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })}
                                        </span>
                                    </div>
                                    {method.cardHolderName && (
                                        <p className="text-gray-700 mt-2">
                                            <span className="font-medium">Cardholder:</span> {method.cardHolderName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end space-x-3 mt-4">
                                    {!method.isDefault && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleSetDefault(method.id)}
                                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm shadow"
                                        >
                                            Set as Default
                                        </motion.button>
                                    )}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDeleteMethod(method.id)}
                                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm shadow"
                                    >
                                        <FaTrash />
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};