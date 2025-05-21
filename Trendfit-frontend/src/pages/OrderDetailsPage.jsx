import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// Removed: import { motion } from 'framer-motion';
import { FaBoxOpen, FaShippingFast, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaCalendarAlt, FaMapMarkerAlt, FaCreditCard, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import orderService from '../services/orderService'; // Assume this new API function exists

const OrderDetailsPage = () => {
    const { orderId } = useParams(); // Get the order ID from the URL
    const { user, loading: authLoading, token } = useAuth();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadOrderDetails = async () => {
            if (!user?.id || !orderId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const data = await orderService.getOrderDetails(orderId, token);
                console.log('order details page: ', data);
                setOrder(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch order details:", err);
                setError('Failed to load order details. Please ensure the order ID is correct and try again.');
            } finally {
                setIsLoading(false);
            }
        };

        if (!authLoading) {
            loadOrderDetails();
        }
    }, [user, orderId, authLoading, token]); // Added token to dependency array for correctness

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return <FaHourglassHalf className="text-yellow-500 mr-2" />;
            case 'processing':
                return <FaBoxOpen className="text-blue-500 mr-2" />;
            case 'shipped':
                return <FaShippingFast className="text-indigo-500 mr-2" />;
            case 'delivered':
                return <FaCheckCircle className="text-green-500 mr-2" />;
            case 'cancelled':
                return <FaTimesCircle className="text-red-500 mr-2" />;
            default:
                return null;
        }
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-indigo-100 text-indigo-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-50 to-gray-100">
                <div // Replaced motion.div with div
                    className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-400"
                ></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-purple-50 to-gray-100">
                <div // Replaced motion.div with div
                    className="text-center p-8 max-w-md"
                >
                    <h1 className="text-4xl font-bold mb-6">Access Denied</h1>
                    <p className="text-xl mb-8">You need to be logged in to view order details</p>
                    <Link
                        to="/login"
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full text-lg font-semibold text-white transition-all duration-300 inline-block"
                    >
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                    <Link to="/orders" className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium">
                        <FaArrowLeft className="mr-2" /> Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <p className="text-center text-gray-500 text-lg">Order not found.</p>
                    <div className="mt-6 text-center">
                        <Link to="/orders" className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300">
                            Back to Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const createdAt = new Date(order.createdAt);
    const estimatedDeliveryDate = order.shippingOption?.estimatedDays
        ? new Date(createdAt.getTime() + order.shippingOption.estimatedDays * 24 * 60 * 60 * 1000)
        : null;

    // Mask payment details for display
    const maskedCardNumber = order.paymentMethod?.lastFourDigits
        ? `**** **** **** ${order.paymentMethod?.lastFourDigits}`
        : 'N/A';
    const cardExpiration = order.paymentMethod?.expirationDate
        ? new Date(order.paymentMethod.expirationDate).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })
        : 'N/A';
    const paymentCardType = order.paymentMethod?.cardType || 'N/A';

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div // Replaced motion.div with div
                className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8"
            >
                <Link to="/orders" className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium mb-6">
                    <FaArrowLeft className="mr-2" /> Back to All Orders
                </Link>

                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
                    Order Details: <span className="text-indigo-600">#{order.orderNumber}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Order Information */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaBoxOpen className="mr-2 text-indigo-500" /> Order Information
                        </h3>
                        <p className="text-gray-700 mb-2">
                            <span className="font-medium">Order Date:</span> {createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-gray-700 mb-2 flex items-center">
                            {getStatusIcon(order.status)}
                            <span className="font-medium">Status:</span> <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>{order.status}</span>
                        </p>
                        {estimatedDeliveryDate && (
                            <p className="text-gray-700 mb-2 flex items-center">
                                <FaCalendarAlt className="mr-2 text-gray-500" />
                                <span className="font-medium">Estimated Delivery:</span> {estimatedDeliveryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        )}
                        <p className="text-gray-700">
                            <span className="font-medium">Total Amount:</span> <span className="text-green-600 font-bold text-lg">{order.totalPrice.toFixed(2)} kr</span>
                        </p>
                    </div>

                    {/* Shipping Address */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-indigo-500" /> Shipping Address
                        </h3>
                        <p className="text-gray-700">{order.shippingAddress?.street || 'N/A'}</p> {/* Added optional chaining */}
                        <p className="text-gray-700">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p> {/* Added optional chaining */}
                        <p className="text-gray-700">{order.shippingAddress?.country}</p> {/* Added optional chaining */}
                        <p className="text-gray-700 mt-2">
                            <span className="font-medium">Shipping Method:</span> {order.shippingOption?.name || 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <FaCreditCard className="mr-2 text-indigo-500" /> Payment Information
                    </h3>
                    <p className="text-gray-700">
                        <span className="font-medium">Method:</span> {order.paymentMethod?.cardType || 'N/A'} {/* Added optional chaining */}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-medium">Card Number:</span> {maskedCardNumber}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-medium">Expiration:</span> {cardExpiration}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-medium">Cardholder:</span> {order.paymentMethod?.cardHolderName || 'N/A'}
                    </p>
                </div>

                {/* Order Items */}
                <div className="mt-8 border-t pt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Items in this Order</h3>
                    <div className="space-y-4">
                        {order.orderItems.map(item => (
                            <div key={item.id} className="flex items-center border p-4 rounded-lg shadow-sm">
                                {item.product?.imageUrl && (
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        className="w-20 h-20 object-cover rounded-md mr-4"
                                    />
                                )}
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 text-lg">{item.product?.name || 'Unknown Product'}</h4>
                                    <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                                    <p className="text-gray-600 text-sm">Unit Price: {item.unitPrice.toFixed(2)} kr</p>
                                    <p className="font-bold text-gray-800">Item Total: {(item.quantity * item.unitPrice).toFixed(2)} kr</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className="mt-8 border-t pt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Price Breakdown</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-gray-700">
                            <span>Subtotal:</span>
                            <span>{(order.totalPrice - (order.taxAmount || 0) - (order.shippingCost || 0)).toFixed(2)} kr</span> {/* Used shippingCost from DTO */}
                        </div>
                        <div className="flex justify-between text-gray-700">
                            <span>Shipping ({order.shippingOption?.name || 'N/A'}):</span>
                            <span>{(order.shippingCost || 0).toFixed(2)} kr</span> {/* Used shippingCost from DTO */}
                        </div>
                        <div className="flex justify-between text-gray-700">
                            <span>Tax:</span>
                            <span>{(order.taxAmount || 0).toFixed(2)} kr</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                            <span>Total:</span>
                            <span>{order.totalPrice.toFixed(2)} kr</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;