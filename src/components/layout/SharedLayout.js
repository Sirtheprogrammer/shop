import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import BottomNav from './BottomNav';

const SharedLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Header />
      
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 pt-20 pb-20 md:pt-24 md:pb-4"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </motion.main>
      
      <BottomNav />
    </div>
  );
};

export default SharedLayout;