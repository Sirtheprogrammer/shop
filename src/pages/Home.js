import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  ChevronRightIcon,
  SparklesIcon,
  FireIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);

        // Fetch products
        let productsQuery = collection(db, 'products');
        if (selectedCategory) {
          productsQuery = query(productsQuery, where('category', '==', selectedCategory));
        }
        const productsSnapshot = await getDocs(productsQuery);
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
        setError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary rounded-full animate-spin mx-auto" style={{ animationDelay: '0.3s', animationDirection: 'reverse' }}></div>
          </div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-slate-600 dark:text-slate-400 font-medium"
          >
            Loading amazing products...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-500 text-3xl">⚠️</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              Oops! Something went wrong
            </h3>
            <p className="text-slate-600 dark:text-slate-400">{error}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative hero-gradient rounded-3xl md:rounded-4xl overflow-hidden p-8 md:p-12 text-white"
      >
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                AnA Group
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Discover amazing products with unbeatable quality and style
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn bg-white text-slate-800 hover:bg-white/90 shadow-xl"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Shop Now
              </motion.button>
            </Link>
            <Link to="/categories">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-glass text-white border-white/30"
              >
                Browse Categories
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-white/10 rounded-full animate-pulse-slow"></div>
      </motion.section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="heading-secondary flex items-center">
              <Squares2X2Icon className="h-8 w-8 mr-3 text-primary" />
              Shop by Category
            </h2>
            <Link
              to="/categories"
              className="text-primary hover:text-primary-dark font-semibold flex items-center group"
            >
              View All
              <ChevronRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link
                  to={`/products?category=${category.id}`}
                  className="block card-solid p-6 text-center space-y-3 group"
                >
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Featured Products */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="heading-secondary flex items-center">
            <FireIcon className="h-8 w-8 mr-3 text-orange-500" />
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-primary hover:text-primary-dark font-semibold flex items-center group"
          >
            View All
            <ChevronRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 card-solid"
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-slate-400 text-3xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
              No products found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We're working on adding amazing products for you!
            </p>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
              >
                Browse All Products
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.slice(0, 10).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="card-gradient p-8 md:p-12 rounded-3xl text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-secondary text-white mb-8">
            Why Choose AnA Group?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <TrophyIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">1000+</h3>
              <p className="text-white/80">Happy Customers</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">500+</h3>
              <p className="text-white/80">Quality Products</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <FireIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">24/7</h3>
              <p className="text-white/80">Customer Support</p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;