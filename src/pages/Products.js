import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = isMobile ? 6 : 12; // 6 items for mobile, 12 for desktop

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const productsRef = collection(db, 'products');
      
      let q;
      if (categoryId) {
        q = query(productsRef, where('category', '==', categoryId));
      } else {
        q = query(productsRef);
      }
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('No products found in the database');
        setProducts([]);
        return;
      }
      
      const productsList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Unnamed Product',
          price: data.price || 0,
          image: data.image || '',
          createdAt: data.createdAt || new Date().toISOString(),
          ...data
        };
      }).filter(product => product.name && product.price); // Only include products with required fields
      
      // Sort products by creation date
      productsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      console.log(`Found ${productsList.length} products`);
      setProducts(productsList);
      setCurrentPage(1); // Reset to first page when category changes
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  // Calculate pagination values
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    // First scroll to top immediately
    window.scrollTo(0, 0);
    
    // Then update the page
    setCurrentPage(page);
    
    // Finally, scroll to the products section with smooth behavior
    setTimeout(() => {
      const productsSection = document.querySelector('.products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Test function to verify direct product access
  useEffect(() => {
    const testProductAccess = async () => {
      try {
        const productsRef = collection(db, 'products');
        const testQuery = query(productsRef, limit(1));
        const testSnapshot = await getDocs(testQuery);
        
        console.log('Test query results:');
        console.log('Documents found:', testSnapshot.size);
        testSnapshot.forEach(doc => {
          console.log('Sample product:', { id: doc.id, ...doc.data() });
        });
      } catch (error) {
        console.error('Test query error:', error);
      }
    };

    testProductAccess();
  }, []);
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
            Loading products...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between"
      >
        <div className="space-y-2">
          <h1 className="heading-secondary">
            {categoryId ? `${getCategoryName(categoryId)} Products` : 'All Products'}
          </h1>
          <p className="text-body">
            Discover our curated collection of high-quality products
          </p>
        </div>
        {categoryId && (
          <div className="mt-4 md:mt-0">
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline"
              >
                View All Products
              </motion.button>
            </Link>
          </div>
        )}
      </motion.div>

      {/* Filters and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-solid p-4 md:p-6 space-y-4"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="input pl-10"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input py-2 px-3 text-sm min-w-0 w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>

            {/* View Mode */}
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-600 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-600 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Filters Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'} !p-2`}
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Price Range
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="input text-sm"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="input text-sm"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000000])}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select className="input text-sm">
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Availability
                </label>
                <select className="input text-sm">
                  <option value="">All Products</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Products Grid/List */}
      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 card-solid"
        >
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-slate-400 text-4xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
            No products found
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {categoryId ? 'No products found in this category.' : 'Try adjusting your search or filters.'}
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Products Count */}
          <div className="flex items-center justify-between">
            <p className="text-slate-600 dark:text-slate-400">
              Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length} products
            </p>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-4 md:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
              : 'grid-cols-1'
          }`}>
            {currentProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <div className="flex items-center space-x-2 card-solid p-2 rounded-2xl">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    currentPage === 1
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  Previous
                </motion.button>
                
                {isMobile ? (
                  <span className="px-4 py-2 bg-gradient-primary text-white rounded-xl font-semibold">
                    {currentPage} / {totalPages}
                  </span>
                ) : (
                  <div className="flex space-x-1">
                    {[...Array(totalPages)].map((_, index) => (
                      <motion.button
                        key={index + 1}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          currentPage === index + 1
                            ? 'bg-gradient-primary text-white shadow-lg'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {index + 1}
                      </motion.button>
                    ))}
                  </div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    currentPage === totalPages
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  Next
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Products;