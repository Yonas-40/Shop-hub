import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import orderService from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';

const OrderDetail = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false); // Track if an update is in progress
    const [updateError, setUpdateError] = useState(null); // Error specific to status update

    const fetchOrder = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getOrderById(id, token);
            console.log('orders: ', data);
            setOrder(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id, token]);

    const updateOrderStatus = async (newStatus) => {
        setIsUpdating(true);
        setUpdateError(null);
        try {
            const updatedOrder = await orderService.updateOrderStatus(id, { status: newStatus }, token);
            setOrder(updatedOrder); // Update the local state with the updated order
            fetchOrder();
        } catch (err) {
            setUpdateError('Failed to update order status.');
            console.error('Error updating order status:', err);
            fetchOrder();
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <div className="text-center py-8">Loading order details...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
    if (!order) return <div className="text-center py-8">Order not found</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="mb-6">
                <Link
                    to="/admin/orders"
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                    <FiArrowLeft className="mr-2" />
                    Back to Orders
                </Link>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">Order #{order.id}</h2>
                    <p className="text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>
                <div className="mt-4 md:mt-0">
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'shipped'
                                ? 'bg-purple-100 text-purple-800'
                                : order.status === 'delivered'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                        }`}>{order.status}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Customer Information</h3>
                    <p className="text-gray-700">{order.user.fullName|| 'Guest'}</p>
                    <p className="text-gray-700">{order.user?.email}</p>
                    {/*<p className="text-gray-700">{order.shippingAddress.phone}</p>*/}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Shipping Information</h3>
                    <p className="text-gray-700">Shipping Method: {order.shippingOption.name}</p>
                    <p className="text-gray-700">Shipping Cost: ${order.shippingOption?.price.toFixed(2)}</p>
                    {/* Shipping Address details might be missing in this response */}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Order Summary</h3>
                    <div className="flex justify-between py-1">
                        <span className="text-gray-600">Total:</span>
                        <span className="text-gray-800">${order.totalPrice?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="text-gray-800">{order.paymentMethod}</span>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Order Items</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {order.orderItems?.map((item) => (
                                <tr key={item.product}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-md" src={item.product.imageUrl || '/placeholder-product.jpg'} alt={item.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{item.product?.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${item.unitPrice?.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${(item.unitPrice * item.quantity)?.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 pt-6">
                <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Update Order Status</h3>
                    <p className="text-sm text-gray-500">
                        Update the status of this order as it progresses through fulfillment.
                    </p>
                    {updateError && <p className="mt-2 text-red-500">{updateError}</p>}
                    {isUpdating && <p className="mt-2 text-blue-500">Updating status...</p>}
                </div>
                <div className="flex space-x-2">
                    {order.status === 'pending' && (
                        <button
                            onClick={() => updateOrderStatus('processing')}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            disabled={isUpdating}
                        >
                            <FiCheckCircle className="mr-2" />
                            Mark as Processing
                        </button>
                    )}
                    {order.status === 'processing' && (
                        <button
                            onClick={() => updateOrderStatus('shipped')}
                            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            disabled={isUpdating}
                        >
                            <FiTruck className="mr-2" />
                            Mark as Shipped
                        </button>
                    )}
                    {order.status === 'shipped' && (
                        <button
                            onClick={() => updateOrderStatus('delivered')}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            disabled={isUpdating}
                        >
                            <FiCheckCircle className="mr-2" />
                            Mark as Delivered
                        </button>
                    )}
                    {order.status !== 'canceled' && order.status !== 'delivered' && (
                        <button
                            onClick={() => updateOrderStatus('cancelled')}
                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            disabled={isUpdating}
                        >
                            <FiXCircle className="mr-2" />
                            Cancel Order
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;