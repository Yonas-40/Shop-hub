import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Shop from './pages/Shop';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import AdminDashboard from './components/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import Products from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import Orders from './pages/admin/Orders';
import OrderDetailsAdmin from './pages/admin/OrderDetail';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './index.css';
import Customers from './pages/admin/Customers';
import Categories from './pages/admin/Category';
import Settings from './pages/admin/AdminProfile';
import CustomerDetails from './pages/admin/CustomerDetails';
import CategoryForm from './pages/admin/CategoryForm';
import Suppliers from './pages/admin/Suppliers';
import SupplierForm from './pages/admin/SupplierForm';
import Carts from './pages/Carts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './pages/Register';
import Profile from './pages/Profile';
import  UserProfile from './components/UserProfile';
import AdminProfile from './pages/admin/AdminProfile';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import About from './pages/About';
import UserOrders from './pages/Orders';
import OrderDetailsPage from './pages/OrderDetailsPage';
import { CartProvider } from './contexts/CartContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        // You can render a loading spinner here
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        // Redirect to the login page if not authenticated
        return <Navigate to="/login" />;
    }

    return children;
};

// Protected Admin Route component (optional, if you have specific admin roles)
const ProtectedAdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated || !user?.roles?.includes('Admin')) { // Assuming your user object has an 'isAdmin' property
        return <Navigate to="/login" />; // Or perhaps a /unauthorized page
    }

    return children;
};

function App() {
    return (
        <Router>
            <div className="app-container">
                <AuthProvider>
                    <CartProvider>

                    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<><Login /></>} />
                        <Route path="/register" element={<><Register /></>} />

                        {/* Protected Routes (require authentication) */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <><Navbar /><Home /><Footer /></>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <><Navbar /><Home /><Footer /></>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <><Navbar /><Profile /><Footer /></>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile/:userId"
                            element={
                                <ProtectedRoute>
                                    <><Navbar /><UserProfile /><Footer /></>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/user-profile"
                            element={
                                <ProtectedRoute>
                                    <><Navbar /><UserProfile /><Footer /></>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/shop"
                            element={
                                <ProtectedRoute>
                                    <><Navbar /><Shop /><Footer /></>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/carts"
                            element={
                                <ProtectedRoute>
                                    <><Navbar /><Carts /><Footer /></>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/checkout"
                            element={
                                <ProtectedRoute>
                                    <><Navbar /><Checkout /><Footer /></>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/order-confirmation/:orderId"
                            element={
                                <ProtectedRoute>
                                    <><Navbar /><OrderConfirmation /><Footer /></>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/about"
                            element={
                                <ProtectedRoute>
                                    <><Navbar /><About /><Footer /></>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/orders"
                            element={
                                <ProtectedRoute>
                                    <><Navbar /><UserOrders /><Footer /></>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/order-details/:orderId"
                            element={
                                <ProtectedRoute>
                                    <><Navbar /><OrderDetailsPage /><Footer /></>
                                </ProtectedRoute>
                            }
                        />
                        {/* Admin Routes (require authentication and admin role) */}
                        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                            <Route index element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                            <Route path="dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                            <Route path="products" element={<ProtectedAdminRoute><Products /></ProtectedAdminRoute>} />
                            <Route path="products/new" element={<ProtectedAdminRoute><ProductForm /></ProtectedAdminRoute>} />
                            <Route path="products/edit/:id" element={<ProtectedAdminRoute><ProductForm /></ProtectedAdminRoute>} />
                            <Route path="orders" element={<ProtectedAdminRoute><Orders /></ProtectedAdminRoute>} />
                            <Route path="orders/:id" element={<ProtectedAdminRoute><OrderDetailsAdmin /></ProtectedAdminRoute>} />
                            <Route path="customers" element={<ProtectedAdminRoute><Customers /></ProtectedAdminRoute>} />
                            <Route path="customers/:id" element={<ProtectedAdminRoute><CustomerDetails /></ProtectedAdminRoute>} />
                            <Route path="categories" element={<ProtectedAdminRoute><Categories /></ProtectedAdminRoute>} />
                            <Route path="/admin/categories/new" element={<ProtectedAdminRoute><CategoryForm /></ProtectedAdminRoute>} />
                            <Route path="/admin/categories/edit/:id" element={<ProtectedAdminRoute><CategoryForm /></ProtectedAdminRoute>} />
                            <Route path="suppliers" element={<ProtectedAdminRoute><Suppliers /></ProtectedAdminRoute>} />
                            <Route path="suppliers/new" element={<ProtectedAdminRoute><SupplierForm /></ProtectedAdminRoute>} />
                            <Route path="suppliers/edit/:id" element={<ProtectedAdminRoute><SupplierForm /></ProtectedAdminRoute>} />
                            <Route path="profile" element={<ProtectedAdminRoute><AdminProfile /></ProtectedAdminRoute>} />
                        </Route>
                    </Routes>

                </CartProvider>
                </AuthProvider>
            </div>
        </Router>
    );
}

export default App;
