import React from 'react';
import { motion } from 'framer-motion';
import { useLocalStorageProducts } from '@/hooks/useLocalStorageProducts';
import { useNavigate } from 'react-router-dom';

function SharedProductsSection() {
  const products = useLocalStorageProducts();
  const sharedProducts = products.slice(0, 12); 
  const navigate = useNavigate();

  if (sharedProducts.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-kayjoko-blue mb-10 text-center">
          Produits partagés
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {sharedProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white border border-gray-100 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative aspect-square">
                <img
                  src={product.images && product.images[0] ? product.images[0] : product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                <p className="font-bold text-kayjoko-blue text-sm">
                  {Number(product.price).toLocaleString()} FCFA
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
           <a href="#search" className="inline-block px-8 py-3 border-2 border-kayjoko-blue text-kayjoko-blue font-bold rounded-full hover:bg-kayjoko-blue hover:text-white transition-all duration-300">
             Rechercher des produits
           </a>
        </div>
      </div>
    </section>
  );
}

export default SharedProductsSection;