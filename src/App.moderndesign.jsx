import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

// Mock components for preview
const MockAuthProvider = ({ children }) => children;
const MockThemeProvider = ({ children }) => children;

// Layout Components
import SharedLayout from './components/layout/SharedLayout';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import ProductCard from './components/ProductCard';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';

// Mock data for preview
const mockProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299000,
    originalPrice: 399000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'electronics',
    categoryName: 'Electronics',
    stock: 15,
    rating: 4.5,
    reviewCount: 128,
    discount: 25
  },
  {
    id: '2',
    name: 'Stylish Leather Jacket',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    category: 'fashion',
    categoryName: 'Fashion',
    stock: 8,
    rating: 4.8,
    reviewCount: 89
  },
  {
    id: '3',
    name: 'Smart Fitness Watch',
    price: 199000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'electronics',
    categoryName: 'Electronics',
    stock: 0,
    rating: 4.3,
    reviewCount: 256
  },
  {
    id: '4',
    name: 'Organic Coffee Beans',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    category: 'food',
    categoryName: 'Food & Beverages',
    stock: 50,
    rating: 4.7,
    reviewCount: 45
  },
  {
    id: '5',
    name: 'Modern Desk Lamp',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
    category: 'home',
    categoryName: 'Home & Garden',
    stock: 12,
    rating: 4.4,
    reviewCount: 67
  },
  {
    id: '6',
    name: 'Wireless Gaming Mouse',
    price: 89000,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    category: 'electronics',
    categoryName: 'Electronics',
    stock: 25,
    rating: 4.6,
    reviewCount: 134
  }
];

const mockCategories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home & Garden' },
  { id: 'food', name: 'Food & Beverages' },
  { id: 'sports', name: 'Sports & Fitness' },
  { id: 'books', name: 'Books & Media' }
];

// Mock context providers
const MockContext = React.createContext();

const MockAuthContext = ({ children }) => {
  const mockUser = {
    uid: 'mock-user-id',
    email: 'user@example.com',
    displayName: 'John Doe',
    isAdmin: false
  };

  return (
    <MockContext.Provider value={{ 
      user: mockUser, 
      logout: () => console.log('Logout clicked'),
      login: () => console.log('Login clicked')
    }}>
      {children}
    </MockContext.Provider>
  );
};

const MockThemeContext = ({ children }) => {
  const [theme, setTheme] = React.useState('light');
  
  return (
    <MockContext.Provider value={{ 
      theme, 
      toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light')
    }}>
      {children}
    </MockContext.Provider>
  );
};

// Mock hooks
export const useAuth = () => React.useContext(MockContext);
export const useTheme = () => React.useContext(MockContext);

// Mock Firebase
export const db = {};
export const collection = () => ({});
export const getDocs = () => Promise.resolve({
  docs: mockProducts.map(product => ({
    id: product.id,
    data: () => product
  }))
});

// Preview Component
const ModernDesignPreview = () => {
  return (
    <div className="min-h-screen">
      <MockThemeContext>
        <MockAuthContext>
          <Router>
            <div className="space-y-8 p-4">
              {/* Header Preview */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  🎨 Modern Header Design
                </h2>
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
                  <Header />
                  <div className="h-20"></div>
                </div>
              </motion.section>

              {/* Product Cards Preview */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  🛍️ Modern Product Cards
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {mockProducts.slice(0, 6).map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>
              </motion.section>

              {/* Hero Section Preview */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  🚀 Hero Section Design
                </h2>
                <div className="relative hero-gradient rounded-3xl overflow-hidden p-8 md:p-12 text-white">
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
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn bg-white text-slate-800 hover:bg-white/90 shadow-xl"
                      >
                        Shop Now
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-glass text-white border-white/30"
                      >
                        Browse Categories
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
                  <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-float-delayed"></div>
                  <div className="absolute top-1/2 right-20 w-12 h-12 bg-white/10 rounded-full animate-pulse-slow"></div>
                </div>
              </motion.section>

              {/* Bottom Navigation Preview */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  📱 Modern Bottom Navigation
                </h2>
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
                  <div className="h-20"></div>
                  <BottomNav />
                </div>
              </motion.section>

              {/* Glass Morphism Cards */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  ✨ Glass Morphism Effects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card p-6 space-y-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      Glass Card
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Beautiful glass morphism effect with backdrop blur
                    </p>
                  </div>

                  <div className="card-solid p-6 space-y-4">
                    <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      Solid Card
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Clean solid card design with subtle shadows
                    </p>
                  </div>

                  <div className="card-gradient p-6 space-y-4 text-white">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h3 className="text-lg font-semibold">
                      Gradient Card
                    </h3>
                    <p className="text-white/80">
                      Vibrant gradient background with smooth transitions
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Button Styles */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  🎯 Modern Button Styles
                </h2>
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary"
                  >
                    Primary Button
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-secondary"
                  >
                    Secondary Button
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-accent"
                  >
                    Accent Button
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-glass"
                  >
                    Glass Button
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-outline"
                  >
                    Outline Button
                  </motion.button>
                </div>
              </motion.section>
            </div>
          </Router>
        </MockAuthContext>
      </MockThemeContext>
    </div>
  );
};

export default ModernDesignPreview;