import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiCreditCard, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import cartService from '../services/cartService';
import orderService from '../services/orderService';
import { fetchShippingOptions, fetchUserAddresses, fetchUserPaymentMethods } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Checkout = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [shippingOptions, setShippingOptions] = useState([]);
    const [activeStep, setActiveStep] = useState(1);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedShippingOption, setSelectedShippingOption] = useState(null);
    const [userAddresses, setUserAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    // Fetch cart items, shipping options, and payment methods
    useEffect(() => {
        const fetchData = async () => {
            if (token && user?.id) {
                setLoading(true);
                try {
                    // Fetch cart items
                    const cartItemsData = await cartService.getCartItems(token, user.id);
                    setCartItems(cartItemsData);

                    // Fetch shipping options
                    const shippingOptionsResponse = await fetchShippingOptions();
                    setShippingOptions(shippingOptionsResponse);
                    if (shippingOptionsResponse.length > 0) {
                        setSelectedShippingOption(shippingOptionsResponse[0].id);
                    }

                    // Fetch payment methods
                    const paymentMethodsResponse = await fetchUserPaymentMethods(user.id);
                    setPaymentMethods(paymentMethodsResponse);
                    if (paymentMethodsResponse.length > 0) {
                        setSelectedPaymentMethod(paymentMethodsResponse[0].id);
                    }
                } catch (err) {
                    console.error("Error fetching data:", err);
                    toast.error('Failed to load checkout data');
                    navigate('/cart');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [token, user?.id, navigate]);

    // Fetch user addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await fetchUserAddresses(user.id);
                setUserAddresses(response);

                // Set default address if available
                const defaultAddress = response.find(addr => addr.isDefault);
                if (defaultAddress) setSelectedAddressId(defaultAddress.id);
            } catch (err) {
                console.error("Error fetching addresses:", err);
            }
        };

        if (user?.id) fetchAddresses();
    }, [user?.id, token]);

    // Calculate order summary
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.1; // 10% tax
    };

    const calculateShippingCost = () => {
        const option = shippingOptions.find(o => o.id === selectedShippingOption);
        return option ? option.price : 0;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax() + calculateShippingCost();
    };

    // Handle checkout submission
    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!selectedAddressId) {
            toast.error('Please select a shipping address');
            setLoading(false);
            return;
        }

        if (!selectedPaymentMethod) {
            toast.error('Please select a payment method');
            setLoading(false);
            return;
        }

        try {
            const orderData = {
                userId: user.id,
                shippingOptionId: selectedShippingOption,
                shippingAddressId: selectedAddressId,
                paymentMethodId: selectedPaymentMethod
            };

            const createdOrder = await orderService.createOrder(orderData, token, user.id);
            navigate(`/order-confirmation/${createdOrder.id}`);
            await cartService.clearCart(token, user.id);
            toast.success('Order placed successfully!');
        } catch (err) {
            console.error("Error during checkout:", err);
            toast.error(err.message || 'Failed to complete checkout');
        } finally {
            setLoading(false);
        }
    };

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

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
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
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 mb-8 transition"
                >
                    <FiArrowLeft className="mr-2" /> Back to Cart
                </button>

                {/* Checkout Steps */}
                <div className="flex justify-between mb-12 relative">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex-1 flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${activeStep >= step ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                {activeStep > step ? (
                                    <FiCheckCircle className="text-xl" />
                                ) : (
                                    <span className="font-medium">{step}</span>
                                )}
                            </div>
                            <span className={`text-sm font-medium ${activeStep >= step ? 'text-indigo-600' : 'text-gray-500'
                                }`}>
                                {step === 1 ? 'Shipping' : step === 2 ? 'Payment' : 'Confirmation'}
                            </span>
                        </div>
                    ))}
                    <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                        <div
                            className={`h-full bg-indigo-600 transition-all duration-300 ${activeStep === 1 ? 'w-1/6' : activeStep === 2 ? 'w-1/2' : 'w-full'
                                }`}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {activeStep === 1 && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center mb-6">
                                    <FiTruck className="text-indigo-500 text-xl mr-3" />
                                    <h2 className="text-xl font-semibold">Shipping Information</h2>
                                </div>
                                <form className="space-y-4">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium mb-3">Select Address</h3>
                                        <div className="space-y-3">
                                            {userAddresses.map(address => (
                                                <div
                                                    key={address.id}
                                                    className={`border rounded-lg p-4 cursor-pointer transition ${selectedAddressId === address.id
                                                        ? 'border-indigo-500 bg-indigo-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    onClick={() => setSelectedAddressId(address.id)}
                                                >
                                                    <div className="flex items-start">
                                                        <input
                                                            type="radio"
                                                            checked={selectedAddressId === address.id}
                                                            onChange={() => { }}
                                                            className="mt-1 h-4 w-4 text-indigo-600"
                                                        />
                                                        <div className="ml-3">
                                                            <p className="font-medium">{address.recipientName || 'No recipient name'}</p>
                                                            <p className="text-sm text-gray-600">{address.street}</p>
                                                            <p className="text-sm text-gray-600">{address.city}, {address.postalCode}</p>
                                                            <p className="text-sm text-gray-600">{address.country}</p>
                                                            {address.isDefault && (
                                                                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => navigate('/account/addresses/new')}
                                            className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                        >
                                            + Add New Address
                                        </button>
                                    </div>

                                    {/* Shipping Options */}
                                    {shippingOptions.length > 0 && (
                                        <div className="pt-4">
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Method</h3>
                                            <div className="space-y-3">
                                                {shippingOptions.map((option) => (
                                                    <div
                                                        key={option.id}
                                                        className={`border rounded-lg p-4 cursor-pointer transition ${selectedShippingOption === option.id
                                                            ? 'border-indigo-500 bg-indigo-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                        onClick={() => setSelectedShippingOption(option.id)}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    id={`shipping-${option.id}`}
                                                                    name="shippingOption"
                                                                    checked={selectedShippingOption === option.id}
                                                                    onChange={() => setSelectedShippingOption(option.id)}
                                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                                                />
                                                                <label htmlFor={`shipping-${option.id}`} className="ml-3 block text-sm font-medium text-gray-700">
                                                                    {option.name}
                                                                </label>
                                                            </div>
                                                            <span className="text-sm font-medium">${option.price.toFixed(2)}</span>
                                                        </div>
                                                        {option.estimatedDelivery && (
                                                            <p className="mt-1 ml-7 text-sm text-gray-500">
                                                                Estimated delivery: {option.estimatedDelivery}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setActiveStep(2)}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition"
                                            disabled={!selectedAddressId}
                                        >
                                            Continue to Payment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeStep === 2 && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center mb-6">
                                    <FiCreditCard className="text-indigo-500 text-xl mr-3" />
                                    <h2 className="text-xl font-semibold">Payment Method</h2>
                                </div>
                                <div className="space-y-4">
                                    {paymentMethods.length > 0 ? (
                                        paymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                className={`border rounded-lg p-4 hover:border-indigo-500 transition cursor-pointer ${selectedPaymentMethod === method.id
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                onClick={() => setSelectedPaymentMethod(method.id)}
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        id={`payment-${method.id}`}
                                                        name="paymentMethod"
                                                        checked={selectedPaymentMethod === method.id}
                                                        onChange={() => setSelectedPaymentMethod(method.id)}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <div className="ml-3">
                                                        <label htmlFor={`payment-${method.id}`} className="block text-sm font-medium text-gray-700">
                                                            {method.cardType} ending in {method.lastFourDigits}
                                                        </label>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Expires {new Date(method.expirationDate).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })}
                                                        </p>
                                                        {method.isDefault && (
                                                            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-600 mb-4">No saved payment methods found</p>
                                            <button
                                                onClick={() => navigate('/account/payment-methods/new')}
                                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                            >
                                                + Add New Payment Method
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="pt-6 flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setActiveStep(1)}
                                        className="text-gray-600 hover:text-gray-800 font-medium"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCheckout}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition"
                                        disabled={!selectedPaymentMethod || paymentMethods.length === 0}
                                    >
                                        Complete Order
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex justify-between items-start">
                                        <div className="flex items-center">
                                            <img
                                                src={item.product.imageUrl || '/placeholder-product.jpg'}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded-lg mr-3"
                                            />
                                            <div>
                                                <p className="text-sm font-medium">{item.product.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 pt-4 space-y-3">
                                <div className="flex justify-between">
                                    <p className="text-sm text-gray-600">Subtotal</p>
                                    <p className="text-sm font-medium">${calculateSubtotal().toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm text-gray-600">Shipping</p>
                                    <p className="text-sm font-medium">${calculateShippingCost().toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm text-gray-600">Tax (10%)</p>
                                    <p className="text-sm font-medium">${calculateTax().toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-gray-200">
                                    <p className="text-base font-semibold">Total</p>
                                    <p className="text-base font-semibold">${calculateTotal().toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;