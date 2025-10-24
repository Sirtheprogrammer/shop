import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ProductReviews from '../components/ProductReviews';
import {
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  ShoppingCartIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

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

  const fetchProduct = useCallback(async () => {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const productData = { id: docSnap.id, ...docSnap.data() };
        setProduct(productData);
        setEditedProduct(productData);
      } else {
        toast.error('Product not found');
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [fetchProduct, fetchCategories]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      const cartRef = doc(db, 'carts', user.uid);
      const cartItemRef = doc(cartRef, 'items', id);
      
      await setDoc(cartItemRef, {
        productId: id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        addedAt: new Date().toISOString()
      }, { merge: true });

      toast.success('Added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    try {
      const wishlistRef = doc(db, 'wishlists', user.uid);
      const wishlistItemRef = doc(wishlistRef, 'items', id);
      
      await setDoc(wishlistItemRef, {
        productId: id,
        name: product.name,
        price: product.price,
        image: product.image,
        addedAt: new Date().toISOString()
      }, { merge: true });

      toast.success('Added to wishlist successfully');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        const imageUrl = data.data.url;
        setEditedProduct(prev => ({ ...prev, image: imageUrl }));
        setImagePreview(imageUrl);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!editedProduct.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!editedProduct.price || editedProduct.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    
    if (!editedProduct.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!editedProduct.category) {
      errors.category = 'Category is required';
    }
    
    if (!editedProduct.image) {
      errors.image = 'Product image is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        name: editedProduct.name.trim(),
        price: parseFloat(editedProduct.price),
        description: editedProduct.description.trim(),
        category: editedProduct.category,
        image: editedProduct.image,
        updatedAt: new Date().toISOString()
      });

      setProduct(editedProduct);
      setIsEditing(false);
      setValidationErrors({});
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleCancelEdit = () => {
    setEditedProduct(product);
    setIsEditing(false);
    setImagePreview('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-600 mt-4">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm">
          {isEditing ? (
            <div className="p-6">
              <div className="relative">
                <label 
                  htmlFor="image-upload" 
                  className={`block p-4 border-2 border-dashed rounded-lg text-center cursor-pointer
                    ${validationErrors.image ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                >
                  <div className="text-gray-600 dark:text-gray-400">
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary mx-auto"></div>
                    ) : (
                      'Click to change image'
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
                {validationErrors.image && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {validationErrors.image}
                  </p>
                )}
              </div>
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-[400px] object-contain w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              className="h-[400px] w-full object-contain rounded-lg"
            />
          )}
        </div>

        {/* Product Details */}
        <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm p-6">
          {isEditing ? (
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editedProduct.name}
                  onChange={(e) => setEditedProduct({...editedProduct, name: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
                    validationErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {validationErrors.name && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price (TZS)
                </label>
                <input
                  type="number"
                  value={editedProduct.price}
                  onChange={(e) => setEditedProduct({...editedProduct, price: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
                    validationErrors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {validationErrors.price && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={editedProduct.category}
                  onChange={(e) => setEditedProduct({...editedProduct, category: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
                    validationErrors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {validationErrors.category && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={editedProduct.description}
                  onChange={(e) => setEditedProduct({...editedProduct, description: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary ${
                    validationErrors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {validationErrors.description && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="flex items-center justify-center w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <CheckIcon className="h-5 w-5 mr-2" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <XMarkIcon className="h-5 w-5 mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
                {user?.isAdmin && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-primary hover:text-primary-dark"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                )}
              </div>

              <h2 className="text-2xl font-semibold text-primary mb-4">
                TZS {parseFloat(product.price).toLocaleString()}
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mb-8">{product.description}</p>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium text-gray-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <HeartIcon className="h-5 w-5 mr-2" />
                  Add to Wishlist
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <ProductReviews productId={id} />
      </div>
    </div>
  );
};

export default ProductDetail; 