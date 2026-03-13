import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const { total } = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Il semble que vous n'ayez pas encore ajouté de produits. Découvrez notre sélection dès maintenant !
        </p>
        <Button onClick={() => navigate('/')} className="bg-kayjoko-blue text-white hover:bg-kayjoko-light-blue px-8 py-6 rounded-full text-lg">
          Commencer le shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence>
              {cartItems.map((item, idx) => (
                <motion.div
                  key={`${item.id}-${JSON.stringify(item.variants)}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img 
                      src={item.images && item.images[0] ? item.images[0] : item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      <Link to={`/product/${item.id}`} className="hover:text-kayjoko-blue transition-colors">
                        {item.name}
                      </Link>
                    </h3>
                    <p className="text-gray-500 text-sm mb-2">
                      {item.variants && Object.entries(item.variants).map(([k, v]) => `${k}: ${v}`).join(', ')}
                    </p>
                    <p className="font-bold text-kayjoko-blue text-lg">
                      {Number(item.price).toLocaleString()} FCFA
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.variants)}
                        className="p-2 hover:bg-gray-50 text-gray-600 rounded-l-lg transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.variants)}
                        className="p-2 hover:bg-gray-50 text-gray-600 rounded-r-lg transition-colors"
                        disabled={item.quantity >= 10}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id, item.variants)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Résumé de la commande</h2>
              
              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-kayjoko-blue">{total.toLocaleString()} FCFA</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-kayjoko-yellow hover:bg-yellow-400 text-kayjoko-dark h-14 text-lg font-bold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Passer à la caisse
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full border-kayjoko-blue text-kayjoko-blue hover:bg-blue-50 h-12"
                >
                  Continuer mes achats
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;