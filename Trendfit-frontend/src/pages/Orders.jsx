import React, { useState, useEffect } from 'react';
import { FaBoxOpen, FaShippingFast, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import orderService from '../services/orderService'; // Assume this exists or adjust to fetchUserProfile
import * as signalR from '@microsoft/signalr'; // Import SignalR client

const SIGNALR_HUB_URL = 'https://localhost:5001/orderHub'; // Your SignalR hub URL

const Orders = () => {
    const { user, loading: authLoading, token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5; // Number of orders to display per page

    useEffect(() => {
        let connection = null;

        const loadOrders = async () => {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const data = await orderService.getUserOrders(user.id, token);
                console.log('user orders: ', data);

                const now = new Date();
                const sortedData = data.sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    const diffA = Math.abs(now.getTime() - dateA.getTime());
                    const diffB = Math.abs(now.getTime() - dateB.getTime());
                    return diffA - diffB;
                });

                setOrders(sortedData);
                setError(null);

                // Initialize SignalR connection
                connection = new signalR.HubConnectionBuilder()
                    .withUrl(SIGNALR_HUB_URL, {
                        accessTokenFactory: () => token // Pass the JWT token for authentication/authorization
                    })
                    .withAutomaticReconnect() // Optional: Automatically try to reconnect
                    .build();

                // Start the connection
                await connection.start()
                    .then(() => {
                        console.log('SignalR Connected.');
                        // If you use groups on the server, join the user's group
                        connection.invoke("JoinUserGroup", user.id)
                            .catch(err => console.error("Failed to join SignalR group:", err));
                    })
                    .catch(err => console.error("SignalR Connection Error: ", err));


                // Listen for 'orderUpdated' events
                connection.on('orderUpdated', (updatedOrder) => {
                    console.log('Received real-time update for order:', updatedOrder);
                    setOrders(prevOrders => {
                        const existingOrderIndex = prevOrders.findIndex(order => order.id === updatedOrder.id);
                        if (existingOrderIndex > -1) {
                            // Update existing order
                            const newOrders = [...prevOrders];
                            newOrders[existingOrderIndex] = updatedOrder;
                            return newOrders;
                        }
                        // If a new order is received, add it and re-sort
                        return [...prevOrders, updatedOrder].sort((a, b) => {
                            const dateA = new Date(a.createdAt);
                            const dateB = new Date(b.createdAt);
                            const diffA = Math.abs(now.getTime() - dateA.getTime());
                            const diffB = Math.abs(now.getTime() - dateB.getTime());
                            return diffA - diffB;
                        });
                    });
                });

            } catch (err) {
                console.error("Failed to fetch orders or establish SignalR connection:", err);
                setError('Failed to load your orders. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        if (!authLoading) { // Only fetch if user authentication is resolved
            loadOrders();
        }

        // Cleanup function for SignalR connection
        return () => {
            if (connection) {
                console.log('SignalR Disconnecting.');
                connection.stop();
            }
        };
    }, [user, authLoading, token]); // Added token to dependency array for correctness

    // Pagination Logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
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
        switch (status.toLowerCase()) {
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
                <div
                    className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-400"
                ></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-purple-50 to-gray-100">
                <div
                    className="text-center p-8 max-w-md"
                >
                    <h1 className="text-4xl font-bold mb-6">Access Denied</h1>
                    <p className="text-xl mb-8">You need to be logged in to view your orders</p>
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

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div
                className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8"
            >
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaBoxOpen className="mr-3 text-indigo-600" /> Your Orders
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg mb-4">You haven't placed any orders yet.</p>
                        <Link to="/shop" className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {currentOrders.map((order) => {
                            const createdAt = new Date(order.createdAt);
                            const estimatedDeliveryDate = order.shippingOption?.estimatedDays
                                ? new Date(createdAt.getTime() + order.shippingOption.estimatedDays * 24 * 60 * 60 * 1000)
                                : null;

                            const productNames = order.orderItems
                                .map(item => item.product?.name)
                                .filter(Boolean)
                                .join(', ');

                            return (
                                <div
                                    key={order.id}
                                    className="border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                                        <div className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)} flex items-center`}>
                                            {getStatusIcon(order.status)} {order.status}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Order Date:</span> {createdAt.toLocaleDateString()}
                                    </p>
                                    {estimatedDeliveryDate && (
                                        <p className="text-gray-600 mb-2 flex items-center">
                                            <FaCalendarAlt className="mr-2 text-gray-500" />
                                            <span className="font-medium">Estimated Delivery:</span> {estimatedDeliveryDate.toLocaleDateString()}
                                        </p>
                                    )}
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-medium">Items:</span> {productNames}
                                    </p>
                                    <p className="text-gray-600 text-lg font-bold">
                                        Total: {order.totalPrice.toFixed(2)} kr
                                    </p>

                                    {/* Optional: Link to a detailed order view page */}
                                    <div className="mt-4 text-right">
                                        <Link
                                            to={`/order-details/${order.id}`} // You'd create this page
                                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            View Details &rarr;
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2 mt-8">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        className={`px-4 py-2 rounded-lg ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;