import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ShoppingCartIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

const ProductCard = ({ product, index = 0 }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (price) => {
    return `TZS ${parseFloat(price).toLocaleString()}`;
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart logic here
    console.log('Added to cart:', product.id);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view logic here
    console.log('Quick view:', product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="product-card overflow-hidden">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton" />
            )}
            
            <img
              src={product.image || '/api/placeholder/300/300'}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
              <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWishlistToggle}
                  className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isWishlisted ? (
                    <HeartIconSolid className="h-4 w-4 text-red-500" />
                  ) : (
                    <HeartIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleQuickView}
                  className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <EyeIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </motion.button>
              </div>

              {/* Quick add to cart button */}
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`w-full py-2 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    product.stock <= 0
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-primary text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ShoppingCartIcon className="h-4 w-4" />
                    <span className="text-sm">
                      {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </span>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Stock badge */}
            {product.stock <= 0 && (
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Discount badge */}
            {product.discount && (
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                  -{product.discount}%
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            {/* Category */}
            {product.categoryName && (
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
                {product.categoryName}
              </span>
            )}

            {/* Product Name */}
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIconSolid
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ({product.reviewCount || 0})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile add to cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`md:hidden p-2 rounded-full transition-all duration-300 ${
                  product.stock <= 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-primary text-white shadow-lg hover:shadow-xl'
                }`}
              >
                <ShoppingCartIcon className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;