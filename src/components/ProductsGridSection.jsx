import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, PackageX, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useKayjokoProducts } from '@/hooks/useKayjokoProducts';
import { useToast } from '@/components/ui/use-toast';

function ProductsGridSection() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { products, loading } = useKayjokoProducts(true);

  const displayProducts = products.slice(0, 12);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Produit ajouté !",
      description: `${product.name} a été ajouté à votre panier.`,
      duration: 3000,
      className: "bg-[#003D7A] text-white border-none",
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#003D7A]" />
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-gray-50 text-center">
         <div className="max-w-[1400px] mx-auto px-6 flex flex-col items-center">
           <PackageX className="w-16 h-16 text-gray-300 mb-4" />
           <h2 className="text-xl font-bold text-gray-400">Aucun produit disponible pour le moment</h2>
           <p className="text-gray-400 mt-2">Notre catalogue est en cours de mise à jour.</p>
         </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[18px] font-bold text-[#003D7A] mb-10 text-center uppercase tracking-wide"
        >
          DÉCOUVREZ NOS PRODUITS
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              whileHover={{ 
                y: -5, 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col cursor-pointer transition-all duration-300 h-full group"
            >
              <div className="h-[180px] w-full flex items-center justify-center mb-4 overflow-hidden rounded-md bg-white relative">
                {/* Product image is already processed to be the primary one in the hook */}
                <img 
                  src={product.image || '/placeholder.png'}
                  alt={product.name}
                  className={`h-full w-full object-contain p-2 ${product.stock <= 0 ? 'opacity-50 grayscale' : ''}`}
                />
                {product.stock <= 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded shadow-lg">RUPTURE DE STOCK</span>
                  </div>
                )}
                {product.badge && product.stock > 0 && (
                   <div className="absolute top-0 left-0 bg-[#4CAF50] text-white text-[10px] font-bold px-2 py-1 rounded-br-lg">
                      {product.badge}
                   </div>
                )}
              </div>

              <div className="flex flex-col flex-grow">
                <h3 className="text-[12px] font-bold text-black mb-1 line-clamp-2 group-hover:text-[#003D7A] transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-[11px] text-gray-500 mb-3 line-clamp-2 min-h-[32px]">
                  {product.description || "Découvrez ce produit exceptionnel."}
                </p>
                
                <div className="mt-auto pt-2 border-t border-gray-100 w-full flex items-center justify-between">
                  <span className="text-[16px] font-bold text-[#003D7A]">
                    {Number(product.price).toLocaleString()} FCFA
                  </span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={product.stock <= 0}
                  className={`w-full mt-3 text-white text-[11px] font-bold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-colors uppercase tracking-wide ${
                    product.stock > 0 
                      ? 'bg-[#003D7A] hover:bg-[#002a54]' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart size={14} />
                  {product.stock > 0 ? 'AJOUTER AU PANIER' : 'ÉPUISÉ'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <Link 
            to="/products" 
            className="group flex items-center gap-2 text-[#003D7A] font-bold text-[14px] hover:underline"
          >
            VOIR PLUS
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProductsGridSection;