import React from 'react';
import { motion } from 'framer-motion';
import { useKayjokoProducts } from '@/hooks/useKayjokoProducts';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

function BestSalesSection() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { products, loading } = useKayjokoProducts(true);
  
  // Assuming 'best sellers' are just a random selection or specific flag for now, 
  // since we don't have sales analytics yet. We'll pick first 4 active items.
  const displayProducts = products.slice(0, 4);

  if (loading) return <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-kayjoko-blue" /></div>;

  if (products.length === 0) {
    return (
        <section className="py-12 bg-white text-center">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-[18px] font-bold text-[#003D7A] mb-4 text-center uppercase">
                    NOS MEILLEURES VENTES SUR KAYJOKKO
                </h2>
                <p className="text-gray-400 text-sm">Pas de données de vente pour l'instant.</p>
            </div>
        </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-[18px] font-bold text-[#003D7A] mb-8 text-center uppercase">
          NOS MEILLEURES VENTES SUR KAYJOKKO
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative h-[180px] w-full bg-white flex items-center justify-center overflow-hidden">
                <img
                  src={product.image || '/placeholder.png'}
                  alt={product.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>

              <div className="p-4 flex flex-col">
                <h3 className="font-bold text-black text-[12px] mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-[11px] text-[#999] mb-2 line-clamp-1">{product.description}</p>
                
                <div className="mb-3">
                   <span className="text-[16px] font-bold text-[#003D7A]">{Number(product.price).toLocaleString()} F</span>
                </div>
                
                <Button 
                  onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                  disabled={product.stock <= 0}
                  className={`w-full text-white text-[11px] font-medium py-2 h-auto rounded ${
                    product.stock > 0 ? 'bg-[#003D7A] hover:bg-blue-900' : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'AJOUTER AU PANIER' : 'ÉPUISÉ'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BestSalesSection;