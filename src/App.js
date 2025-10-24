
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout Components
import SharedLayout from './components/layout/SharedLayout';
import Categories from './pages/Categories';
import AIAssistant from './components/AIAssistant';

// Pages
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';

function App() {

  
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div>
            <Routes>
              <Route path="/" element={<SharedLayout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="categories" element={<Categories />} />
                <Route path="cart" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="wishlist" element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Admin Routes */}
              <Route path="admin" element={
                <ProtectedRoute adminOnly>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              <Route path="admin/products" element={
                <ProtectedRoute adminOnly>
                  <AdminProducts />
                </ProtectedRoute>
              } />
              <Route path="admin/products/add" element={
                <ProtectedRoute adminOnly>
                  <AddProduct />
                </ProtectedRoute>
              } />
              <Route path="admin/products/edit/:id" element={
                <ProtectedRoute adminOnly>
                  <EditProduct />
                </ProtectedRoute>
              } />
              <Route path="admin/orders" element={
                <ProtectedRoute adminOnly>
                  <AdminOrders />
                </ProtectedRoute>
              } />
              <Route path="admin/users" element={
                <ProtectedRoute adminOnly>
                  <AdminUsers />
                </ProtectedRoute>
              } />

              {/* Auth routes */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Routes>
            <AIAssistant />
            <ToastContainer position="bottom-right" />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;