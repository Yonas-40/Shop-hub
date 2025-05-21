import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
        >
            <Link to={`/products/${product.id}`}>
                <div className="h-48 overflow-hidden">
                    <img
                        src={product.image || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            </Link>

            <div className="p-4">
                <Link to={`/products/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-indigo-600">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                    {product.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                    </span>
                    <button
                        onClick={() => addToCart(product)}
                        className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;