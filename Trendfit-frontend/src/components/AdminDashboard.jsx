import { useState } from 'react';
import {
    FiMenu,
    FiSearch,
    FiBell,
    FiUser,
    FiHome,
    FiPackage,
    FiShoppingCart,
    FiUsers,
    FiBarChart2,
    FiSettings,
    FiDollarSign,
    FiTrendingUp,
    FiShoppingBag
} from 'react-icons/fi';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
);

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Chart data
    const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Sales',
                data: [5000, 8000, 12000, 6000, 9000, 14000, 16000],
                backgroundColor: 'rgba(79, 70, 229, 0.7)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1,
            },
        ],
    };

    const ordersData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Orders',
                data: [120, 180, 220, 150, 200, 250, 300],
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
            },
        ],
    };

    // Recent orders data
    const recentOrders = [
        { id: '#SH-1001', customer: 'John Doe', date: '2023-07-15', amount: '$120.00', status: 'Completed' },
        { id: '#SH-1002', customer: 'Jane Smith', date: '2023-07-14', amount: '$85.50', status: 'Processing' },
        { id: '#SH-1003', customer: 'Robert Johnson', date: '2023-07-14', amount: '$220.00', status: 'Completed' },
        { id: '#SH-1004', customer: 'Emily Davis', date: '2023-07-13', amount: '$64.99', status: 'Shipped' },
        { id: '#SH-1005', customer: 'Michael Wilson', date: '2023-07-12', amount: '$175.25', status: 'Completed' },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            
            <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                                    <FiDollarSign className="text-xl" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Sales</p>
                                    <p className="text-2xl font-semibold text-gray-800">$24,780</p>
                                    <p className="text-sm text-green-500 flex items-center">
                                        <FiTrendingUp className="mr-1" /> 12.5% from last month
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                                    <FiShoppingBag className="text-xl" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                    <p className="text-2xl font-semibold text-gray-800">1,248</p>
                                    <p className="text-sm text-green-500 flex items-center">
                                        <FiTrendingUp className="mr-1" /> 8.3% from last month
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                                    <FiUsers className="text-xl" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Customers</p>
                                    <p className="text-2xl font-semibold text-gray-800">856</p>
                                    <p className="text-sm text-green-500 flex items-center">
                                        <FiTrendingUp className="mr-1" /> 5.7% from last month
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                                    <FiPackage className="text-xl" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                                    <p className="text-2xl font-semibold text-gray-800">342</p>
                                    <p className="text-sm text-green-500 flex items-center">
                                        <FiTrendingUp className="mr-1" /> 3.2% from last month
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h3>
                            <div className="h-80">
                                <Bar
                                    data={salesData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders Overview</h3>
                            <div className="h-80">
                                <Line
                                    data={ordersData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">View All</a>
                        </div>

                        <div className="overflow-x-auto ">
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
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                                {order.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.customer}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.status === 'Processing'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
          
            </div>
        </div>
    );
};

export default AdminDashboard;