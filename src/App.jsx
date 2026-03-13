import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ScrollToTop from '@/components/ScrollToTop';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import CategoryPage from '@/pages/CategoryPage';
import SubcategoryPage from '@/pages/SubcategoryPage';
import ProductPage from '@/pages/ProductPage'; 
import ProductDetailPage from '@/pages/ProductDetailPage'; 
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import Contact from '@/pages/Contact';
import Products from '@/pages/Products';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminProductsPage from '@/pages/AdminProductsPage';
import AdminCategoriesPage from '@/pages/AdminCategoriesPage';
import PrivateRoute from '@/components/PrivateRoute';
import { Toaster } from '@/components/ui/toaster';
import WhatsAppPopup from '@/components/WhatsAppPopup';
import { CartProvider } from '@/context/CartContext';
import { AdminProvider } from '@/context/AdminContext';
import { initializeStorage } from '@/utils/initializeStorage';
import { seoPages, defaultSEO } from '@/utils/seoConfig';
import { fetchAndUpdateSubcategories } from '@/data/categoriesData';

function App() {
  useEffect(() => {
    initializeStorage();
    fetchAndUpdateSubcategories();
  }, []);

  return (
    <AdminProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Helmet defaultTitle={defaultSEO.title} titleTemplate="%s | KAYJOKKO.com">
            <meta name="description" content={defaultSEO.description} />
            <meta name="keywords" content={defaultSEO.keywords} />
          </Helmet>
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="contact" element={<Contact />} />
              <Route path="products" element={<Products />} />
              <Route path="category/:categoryName" element={<CategoryPage />} />
              <Route path="category/:categoryName/:subcategoryName" element={<SubcategoryPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order-confirmation" element={<OrderConfirmationPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route path="/admin/dashboard" element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/admin/products" element={
              <PrivateRoute>
                <AdminProductsPage />
              </PrivateRoute>
            } />

            <Route path="/admin/categories" element={
              <PrivateRoute>
                <AdminCategoriesPage />
              </PrivateRoute>
            } />
          </Routes>
          <Toaster />
          <WhatsAppPopup />
        </BrowserRouter>
      </CartProvider>
    </AdminProvider>
  );
}

export default App;