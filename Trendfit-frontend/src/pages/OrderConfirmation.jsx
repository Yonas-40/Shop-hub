import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiShoppingBag, FiTruck, FiCreditCard } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import orderService from '../services/orderService';
import { toast } from 'react-toastify';

const OrderConfirmation = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    console.log(orderId);
    // Fetch order details
    useEffect(() => {
        const fetchOrderDetails = async () => {
            setLoading(true);
            try {
                const orderData = await orderService.getOrderById(orderId, token);
                console.log('order by id: ', orderData);
                setOrder(orderData);
            } catch (error) {
                console.error('Error fetching order details:', error);
                toast.error('Failed to load order details');
                navigate('/orders');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId, token, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Order not found</h2>
                    <button
                        onClick={() => navigate('/shop')}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                        <FiCheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h1 className="mt-4 text-3xl font-bold text-gray-900">Order Confirmed!</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Thank you for your purchase. Your order has been received.
                    </p>
                    <p className="mt-2 text-gray-500">
                        Order #: {order.orderNumber || order.id}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-6">Order Details</h2>
                    <div className="space-y-4">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-4 border-b border-gray-100">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg mr-4">
                                        <img
                                            src={item.product?.imageUrl || '/placeholder-product.jpg'}
                                            alt={item.product?.name}
                                            className="w-12 h-12 object-cover rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">{item.product?.name || `Product ${index + 1}`}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-medium">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                        <div className="flex justify-between">
                            <p className="text-gray-600">Subtotal</p>
                            <p className="font-medium">${(order.totalPrice - order.shippingCost - (order.totalPrice * 0.1)).toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-600">Shipping</p>
                            <p className="font-medium">${order.shippingCost.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-600">Tax (10%)</p>
                            <p className="font-medium">${(order.totalPrice * 0.1).toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-gray-200">
                            <p className="font-semibold">Total</p>
                            <p className="font-semibold">${order.totalPrice.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center mb-4">
                            <FiTruck className="text-indigo-500 mr-3" />
                            <h3 className="font-semibold">Shipping Information</h3>
                        </div>
                        <div className="space-y-2 text-gray-600">
                            <p>{order.shippingAddress?.street || 'Not specified'}</p>
                            <p>{order.shippingAddress?.city || ''}, {order.shippingAddress?.postalCode || ''}</p>
                            <p>{order.shippingAddress?.country || ''}</p>
                            <p className="mt-2 text-sm">
                                <span className="font-medium">Method:</span> {order.shippingMethod}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Status:</span> {order.status || 'Processing'}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center mb-4">
                            <FiCreditCard className="text-indigo-500 mr-3" />
                            <h3 className="font-semibold">Payment Method</h3>
                        </div>
                        <div className="text-gray-600">
                            {order.paymentMethod === 'credit_card' && (
                                <>
                                    <p>Credit Card</p>
                                    <p className="text-sm text-gray-500 mt-1">Payment processed successfully</p>
                                </>
                            )}
                            {order.paymentMethod === 'paypal' && (
                                <>
                                    <p>PayPal</p>
                                    <p className="text-sm text-gray-500 mt-1">Payment processed successfully</p>
                                </>
                            )}
                            {order.paymentMethod === 'bank_transfer' && (
                                <>
                                    <p>Bank Transfer</p>
                                    <p className="text-sm text-gray-500 mt-1">Awaiting payment confirmation</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => navigate('/shop')}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <FiShoppingBag className="mr-2" />
                        Continue Shopping
                    </button>
                    <p className="mt-4 text-gray-500">
                        Need help? <button onClick={() => navigate('/contact')} className="text-indigo-600 hover:text-indigo-500">Contact us</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;