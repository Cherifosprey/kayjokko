import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Truck, ShieldCheck, RefreshCw, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLocalStorageProducts } from '@/hooks/useLocalStorageProducts';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ImageGallery from '@/components/ImageGallery';
import ProductCard from '@/components/ProductCard';

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useLocalStorageProducts();
  const product = products.find(p => p.id === parseInt(id));
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});

  // Similar products logic
  const similarProducts = product 
    ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const defaults = {};
    if (product && product.variants) {
      Object.keys(product.variants).forEach(key => {
        defaults[key] = product.variants[key][0];
      });
      setSelectedVariants(defaults);
    }
  }, [product, id]);

  if (!product && products.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-6">Produit non trouvé.</p>
          <Button onClick={() => navigate('/')} className="bg-[#003D7A]">Retour à l'accueil</Button>
        </div>
      </div>
    );
  } else if (!product) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#003D7A] border-t-transparent rounded-full animate-spin"></div>
          </div>
      )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
    toast({
      title: "Produit ajouté !",
      description: `${quantity} x ${product.name} ajouté au panier.`,
      className: "bg-[#003D7A] text-white border-none",
    });
  };

  const handleVariantChange = (key, value) => {
    setSelectedVariants(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <span onClick={() => navigate('/')} className="cursor-pointer hover:text-[#003D7A]">Accueil</span>
            <ChevronRight size={14} className="mx-2" />
            <span onClick={() => navigate('/products')} className="cursor-pointer hover:text-[#003D7A]">Boutique</span>
            <ChevronRight size={14} className="mx-2" />
            <span onClick={() => navigate(`/category/${product.category}`)} className="cursor-pointer hover:text-[#003D7A]">{product.categoryName || product.category}</span>
            <ChevronRight size={14} className="mx-2" />
            <span className="font-semibold text-gray-900">{product.name}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Left Column: Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ImageGallery 
              images={product.images && product.images.length > 0 ? product.images : [product.image]} 
              productName={product.name} 
            />
          </motion.div>

          {/* Right Column: Info */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="space-y-6"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                 <span className="text-sm font-bold text-[#003D7A] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wide">
                   {product.brand || product.categoryName || product.category}
                 </span>
                 {product.stock <= 5 && product.stock > 0 && (
                   <span className="text-sm font-bold text-red-500">Plus que {product.stock} en stock !</span>
                 )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 4) ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.reviewCount || 12} avis)</span>
              </div>

              <div className="flex items-end gap-3">
                <div className="text-4xl font-bold text-[#003D7A]">
                  {Number(product.price).toLocaleString()} FCFA
                </div>
                {product.originalPrice && (
                    <div className="text-lg text-gray-400 line-through mb-1">
                        {Number(product.originalPrice).toLocaleString()} FCFA
                    </div>
                )}
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm md:text-base border-t border-b border-gray-100 py-4">
              {product.description || "Aucune description disponible pour ce produit."}
            </p>

            {/* Variants */}
            {product.variants && Object.entries(product.variants).map(([key, options], idx) => (
              <div key={key}>
                <h3 className="text-sm font-medium text-gray-900 uppercase mb-3">{key}</h3>
                <div className="flex flex-wrap gap-3">
                  {options.map(option => (
                    <button
                      key={option}
                      onClick={() => handleVariantChange(key, option)}
                      className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                        selectedVariants[key] === option
                          ? 'border-[#003D7A] bg-blue-50 text-[#003D7A] font-bold shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <div className="flex items-center border border-gray-200 rounded-lg h-12">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 h-full text-gray-600 hover:bg-gray-50 rounded-l-lg transition-colors text-lg"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  readOnly 
                  className="w-12 text-center text-gray-900 font-bold focus:outline-none h-full"
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  className="px-4 h-full text-gray-600 hover:bg-gray-50 rounded-r-lg transition-colors text-lg"
                >
                  +
                </button>
              </div>

              <Button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-[#003D7A] hover:bg-[#002a54] text-white h-12 text-base font-bold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.stock === 0 ? 'RUPTURE DE STOCK' : 'AJOUTER AU PANIER'}
              </Button>
              
              <Button variant="outline" size="icon" className="h-12 w-12 border-gray-200 hover:text-red-500 hover:border-red-200 hover:bg-red-50">
                <Heart className="w-6 h-6" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6">
              {[
                { icon: Truck, text: "Livraison Rapide", sub: "Partout au Sénégal" },
                { icon: ShieldCheck, text: "Garantie 30J", sub: "Satisfait ou remboursé" },
                { icon: RefreshCw, text: "Retours Faciles", sub: "Sous 14 jours" }
              ].map((badge, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <badge.icon className="w-6 h-6 text-[#003D7A] mb-2" />
                  <span className="font-bold text-gray-900 text-xs">{badge.text}</span>
                  <span className="text-[10px] text-gray-500">{badge.sub}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
           <section className="mb-12">
             <h2 className="text-2xl font-bold text-gray-900 mb-6">Produits similaires</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map(p => (
                   <ProductCard key={p.id} product={p} />
                ))}
             </div>
           </section>
        )}
      </div>
    </div>
  );
}

export default ProductPage;