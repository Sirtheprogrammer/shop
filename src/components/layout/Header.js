import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  HeartIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'nav-glass shadow-lg backdrop-blur-md' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold text-lg">A</span>
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold text-gradient">
                  AnA Group
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                  Supplies
                </p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                  />
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 md:p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5 text-yellow-500" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-slate-600" />
                )}
              </motion.button>

              {/* Search Button - Mobile */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600"
                onClick={() => navigate('/search')}
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </motion.button>

              {user && (
                <>
                  {/* Notifications */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="hidden md:block p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 relative"
                  >
                    <BellIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      3
                    </span>
                  </motion.button>

                  {/* Wishlist */}
                  <Link to="/wishlist">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 md:p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 relative"
                    >
                      <HeartIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </motion.div>
                  </Link>

                  {/* Cart */}
                  <Link to="/cart">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 md:p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 relative"
                    >
                      <ShoppingCartIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      {cartCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-semibold"
                        >
                          {cartCount}
                        </motion.span>
                      )}
                    </motion.div>
                  </Link>
                </>
              )}

              {/* User Menu */}
              <div className="relative">
                {user ? (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 md:p-3 rounded-xl bg-gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <UserIcon className="h-5 w-5" />
                  </motion.button>
                ) : (
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-4 py-2 md:px-6 md:py-3 bg-gradient-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Login
                    </motion.button>
                  </Link>
                )}

                {/* User Dropdown */}
                <AnimatePresence>
                  {user && isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {user.displayName || user.email}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                      
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      
                      {user.isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      
                      <hr className="my-2 border-slate-200 dark:border-slate-700" />
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                ) : (
                  <Bars3Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden pb-4 overflow-hidden"
              >
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                  />
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;