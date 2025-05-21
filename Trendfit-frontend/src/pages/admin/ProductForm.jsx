import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX } from 'react-icons/fi';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import supplierService from '../../services/supplierService'; // Import supplier service
import { useAuth } from '../../contexts/AuthContext';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(!!id);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        discount: 0,
        category: '',
        categoryId: '',
        supplierId: '',
        stock: 0,
        image: '',
        isFeatured: false,
        rating: 0,
        reviews: 0
    });
    const [categories, setCategories] = useState([]); // State to store categories
    const [suppliers, setSuppliers] = useState([]); // State for suppliers

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories(token);
                setCategories(data);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError(err.message);
            }
        };

        fetchCategories();

        const fetchSuppliers = async () => {
            try {
                const data = await supplierService.getAllSuppliers(token); // Assuming this function exists
                setSuppliers(data);
            } catch (err) {
                console.error('Error fetching suppliers:', err);
                setError(err.message);
            }
        };
        fetchSuppliers();
    }, [token]);
    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const product = await productService.getProductById(id, token);
                    console.log('Fetched product: ', product); // Debugging line to check fetched data')
                    setFormData({
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        category: product.category || '',
                        discount: product.discount || 0,
                        categoryId: product.category?.id || '',
                        supplierId: product.supplier?.id || '',
                        stock: product.stock || 0,
                        imageUrl: product.imageUrl || '',
                        isFeatured: product.isFeatured || false,
                        rating: product.rating || 0,
                        reviews: product.reviews || 0
                    });
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                categoryId: formData.categoryId,
                supplierId: formData.supplierId
            };
            if (id) {
                await productService.updateProduct(id, payload, token);
            } else {
                await productService.createProduct(payload, token);
            }
            navigate('/admin/products');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="text-center py-8">Loading product data...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {id ? 'Edit Product' : 'Create New Product'}
                </h2>
                <button
                    onClick={() => navigate('/admin/products')}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    <FiX className="mr-2" />
                    Cancel
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-1">
                            Supplier
                        </label>
                        <select
                            id="supplierId"
                            name="supplierId"
                            value={formData.supplierId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required // Make sure it's required
                        >
                            <option value="">Select Supplier</option>
                            {suppliers.map(supplier => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Price
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                            Stock Quantity
                        </label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            min="0"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {/* Discount Field */}
                    <div>
                        <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                            Discount (%)
                        </label>
                        <input
                            type="number"
                            id="discount"
                            name="discount"
                            min="0"
                            max="100"
                            value={formData.discount}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Rating Field */}
                    <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                            Rating (0-5)
                        </label>
                        <input
                            type="number"
                            id="rating"
                            name="rating"
                            min="0"
                            max="5"
                            step="0.1"
                            value={formData.rating}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Reviews Field */}
                    <div>
                        <label htmlFor="reviews" className="block text-sm font-medium text-gray-700 mb-1">
                            Review Count
                        </label>
                        <input
                            type="number"
                            id="reviews"
                            name="reviews"
                            min="0"
                            value={formData.reviews}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL
                        </label>
                        <input
                            type="url"
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="https://example.com/image.jpg"
                        />
                        {formData.imageUrl && (
                            <div className="mt-2">
                                <img
                                    src={formData.imageUrl}
                                    alt="Product preview"
                                    className="h-40 object-contain border rounded-lg"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-product.jpg';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    {/* New Featured Checkbox */}
                    <div className="md:col-span-2">
                        <div className="flex items-center">
                            <input
                                id="isFeatured"
                                name="isFeatured"
                                type="checkbox"
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                            />
                            <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                                Featured Product
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        <FiSave className="mr-2" />
                        Save Product
                    </button>
                </div>
            </form>
            </div>
    );
};

export default ProductForm;