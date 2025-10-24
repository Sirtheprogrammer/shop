import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  HeartIcon as HeartIconSolid,
  UserIcon as UserIconSolid,
  Squares2X2Icon as Squares2X2IconSolid
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      requireAuth: false
    },
    {
      name: 'Categories',
      path: '/categories',
      icon: Squares2X2Icon,
      iconSolid: Squares2X2IconSolid,
      requireAuth: false
    },
    {
      name: 'Search',
      path: '/products',
      icon: MagnifyingGlassIcon,
      iconSolid: MagnifyingGlassIconSolid,
      requireAuth: false
    },
    {
      name: 'Cart',
      path: '/cart',
      icon: ShoppingCartIcon,
      iconSolid: ShoppingCartIconSolid,
      requireAuth: true,
      badge: 3 // This would come from cart context
    },
    {
      name: 'Profile',
      path: user ? '/profile' : '/login',
      icon: UserIcon,
      iconSolid: UserIconSolid,
      requireAuth: false
    }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bottom-nav border-t border-slate-200/50 dark:border-slate-700/50"
    >
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = isActive(item.path) ? item.iconSolid : item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-item ${active ? 'active' : ''} relative`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center space-y-1"
                >
                  <div className="relative">
                    <Icon className="h-6 w-6" />
                    
                    {/* Badge for cart */}
                    {item.badge && item.badge > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-semibold"
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </motion.span>
                    )}
                  </div>
                  
                  <span className="text-xs font-medium">
                    {item.name}
                  </span>
                </motion.div>

                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Safe area for iPhone */}
      <div className="h-safe-bottom bg-inherit" />
    </motion.nav>
  );
};

export default BottomNav;