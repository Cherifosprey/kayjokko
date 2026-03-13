import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import CheckoutForm from '@/components/CheckoutForm';
import OrderSummary from '@/components/OrderSummary';

function CheckoutPage() {
  const { cartItems, getCartTotal } = useCart();
  const navigate = useNavigate();
  const { subtotal, shipping, tax, total } = getCartTotal();

  React.useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Validation de commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <CheckoutForm />
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5">
            <OrderSummary 
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              // Removed onConfirm here because CheckoutForm handles the final submission logic now
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;