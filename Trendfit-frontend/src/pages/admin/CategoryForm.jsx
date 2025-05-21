import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX } from 'react-icons/fi';
import categoryService from '../../services/categoryService'; // Assuming you have this service
import { useAuth } from '../../contexts/AuthContext';

const CategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(!!id);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: ''
    });

    useEffect(() => {
        if (id) {
            const fetchCategory = async () => {
                try {
                    const category = await categoryService.getCategoryById(id, token);
                    console.log('Fetched category: ', category); // Debugging line
                    setFormData({
                        name: category.name
                    });
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchCategory();
        } else {
            // When adding a new category, the form is already empty due to the initial state
            setLoading(false); // Ensure loading is false for new category form
        }
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await categoryService.updateCategory(id, formData, token);
            } else {
                await categoryService.createCategory(formData, token);
            }
            navigate('/admin/categories');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="text-center py-8">Loading category data...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {id ? 'Edit Category' : 'Create New Category'}
                </h2>
                <button
                    onClick={() => navigate('/admin/categories')}
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
                <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name
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

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        <FiSave className="mr-2" />
                        Save Category
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;