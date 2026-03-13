import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalStorageProducts } from '@/hooks/useLocalStorageProducts';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

function BestChoiceSection() {
  const products = useLocalStorageProducts();
  const bestProducts = products.slice(0, 8); // Simulate best choice products
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté.`,
    });
  };

  if (bestProducts.length === 0) {
    return (
        <section className="py-16 bg-white text-center">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-kayjoko-blue mb-4">
                    Meilleur choix de la semaine sur KAYJOKKO
                </h2>
                <p className="text-gray-400">Aucun produit sélectionné pour le moment.</p>
            </div>
        </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-kayjoko-blue">
            Meilleur choix de la semaine sur KAYJOKKO
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden group cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                  src={product.images && product.images[0] ? product.images[0] : product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 animate-pulse-slow">
                  Meilleur choix
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="icon" variant="secondary" className="rounded-full bg-white text-gray-500 hover:text-red-500 hover:bg-white shadow-md">
                        <Heart className="w-5 h-5" />
                    </Button>
                </div>
              </div>

              <div className="p-5">
                <p className="text-gray-500 text-sm mb-1">{product.category}</p>
                <h3 className="font-bold text-lg text-gray-900 mb-2 truncate group-hover:text-kayjoko-blue transition-colors">
                  {product.name}
                </h3>
                <p className="text-xl font-bold text-kayjoko-blue mb-4">
                  {Number(product.price).toLocaleString()} FCFA
                </p>
                
                <Button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-full bg-kayjoko-blue hover:bg-kayjoko-light-blue text-white font-medium shadow-md transition-all duration-300 rounded-lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Ajouter au panier
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-right">
            <a href="#products" className="text-kayjoko-blue font-bold text-lg hover:underline inline-flex items-center">
                ACHETER PLUS <span className="ml-2">&rarr;</span>
            </a>
        </div>
      </div>
    </section>
  );
}

export default BestChoiceSection;