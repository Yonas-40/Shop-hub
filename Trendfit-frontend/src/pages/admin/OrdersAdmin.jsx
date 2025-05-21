import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiTruck, FiCheckCircle } from 'react-icons/fi';
import orderService from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';

const OrdersAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const { token } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getAllOrders(token);
                console.log('Fetched orders: ', data);
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const filteredOrders = statusFilter === 'all'
        ? orders
        : orders.filter(order => order.status === statusFilter);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const updatedOrder = await orderService.updateOrderStatus(orderId, { status: newStatus }, token);
            setOrders(orders.map(order =>
                order.id === orderId ? updatedOrder : order
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="text-center py-8">Loading orders...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    return (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Orders Management</h2>
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">All Orders</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                                #{order.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.userName || 'Guest'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ${order.totalPrice.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : order.status === 'Processing'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : order.status === 'Shipped'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : order.status === 'Delivered'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <Link
                                                    to={`/admin/orders/${order.id}`}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    title="View Details"
                                                >
                                                    <FiEye className="inline" />
                                                </Link>
                                                {order.status === 'Processing' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'Shipped')}
                                                        className="text-purple-600 hover:text-purple-900"
                                                        title="Mark as Shipped"
                                                    >
                                                        <FiTruck className="inline" />
                                                    </button>
                                                )}
                                                {order.status === 'Shipped' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Mark as Delivered"
                                                    >
                                                        <FiCheckCircle className="inline" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
          
      
    );
};

export default OrdersAdmin;