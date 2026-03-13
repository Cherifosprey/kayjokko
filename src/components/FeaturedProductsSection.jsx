import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const products = [
  {
    id: 1,
    name: 'Berline de Luxe 2024',
    category: 'Voitures',
    price: '12 000 000 FCFA',
    image: 'https://images.unsplash.com/photo-1601598851547-4302969d0614',
    badge: 'Nouveau',
    featured: true
  },
  {
    id: 2,
    name: 'Villa Moderne Dakar',
    category: 'Immobilier',
    price: '150 000 000 FCFA',
    image: 'https://images.unsplash.com/photo-1703223915225-adc35421ce2c',
    badge: 'Vedette',
    featured: true
  },
  {
    id: 3,
    name: 'Drone Professionnel 4K',
    category: 'Électronique',
    price: '850 000 FCFA',
    image: 'https://images.unsplash.com/photo-1566770513587-c0667d61f6f9',
    badge: '',
    featured: true
  },
  {
    id: 4,
    name: 'Collection Été Homme',
    category: 'Mode',
    price: '25 000 FCFA',
    image: 'https://images.unsplash.com/photo-1622948536459-7203ffcd5b0b',
    badge: 'Nouveau',
    featured: true
  },
  {
    id: 5,
    name: 'Montre Chronographe',
    category: 'Accessoires',
    price: '120 000 FCFA',
    image: 'https://images.unsplash.com/photo-1457449221050-c1bb9bd3cab0',
    badge: 'Promo',
    featured: true
  },
  {
    id: 6,
    name: 'Sneakers Urban Style',
    category: 'Mode',
    price: '45 000 FCFA',
    image: 'https://images.unsplash.com/photo-1675825547463-0788eca2320e',
    badge: '',
    featured: true
  }
];

function FeaturedProductsSection() {
  const { toast } = useToast();

  const handleAction = (action, product) => {
    toast({
      title: action === 'cart' ? "Ajouté au panier" : "Ajouté aux favoris",
      description: `${product} a été ajouté à votre liste.`,
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-10"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Produits en <span className="text-kayjoko-blue">Vedette</span>
            </h2>
            <p className="text-gray-500">Les meilleures offres sélectionnées pour vous</p>
          </div>
          <Button variant="outline" className="hidden md:flex text-kayjoko-blue border-kayjoko-blue hover:bg-kayjoko-blue hover:text-white">
            Voir tout
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-3 left-3 bg-kayjoko-yellow text-kayjoko-dark text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                    {product.badge}
                  </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    className="bg-white text-kayjoko-dark hover:bg-kayjoko-blue hover:text-white rounded-full transition-colors"
                    onClick={() => handleAction('view', product.name)}
                  >
                    <Eye className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    className="bg-white text-kayjoko-dark hover:bg-kayjoko-red hover:text-white rounded-full transition-colors"
                    onClick={() => handleAction('like', product.name)}
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">{product.category}</div>
                <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-kayjoko-blue transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-kayjoko-red font-bold text-lg">
                    {product.price}
                  </span>
                  <button 
                    onClick={() => handleAction('cart', product.name)}
                    className="text-gray-400 hover:text-kayjoko-blue transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="w-full text-kayjoko-blue border-kayjoko-blue">
            Voir tout le catalogue
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProductsSection;