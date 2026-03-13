import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, MessageCircle, ArrowLeft, Star, Truck, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useKayjokoProducts } from '@/hooks/useKayjokoProducts';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient.js';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  // Fetch specific product logic or use global hook.
  // We'll use global hook for simplicity but ideally fetching single product is better.
  // Given constraints, I'll rely on the existing hook pattern but fetch related too.
  const { products, loading: productsLoading } = useKayjokoProducts(true);
  
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!productsLoading) {
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setActiveImage(foundProduct.image || foundProduct.images[0] || '/placeholder.png');
        
        // Find related products by CATEGORY
        const related = products
          .filter(p => p.category_id === foundProduct.category_id && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
        
        setLoading(false);
      } else if (products.length > 0) {
         setLoading(false);
      }
    }
  }, [id, products, productsLoading]);

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const message = `Bonjour, je suis intéressé par le produit : ${product.name} à ${product.price} FCFA sur KAYJOKKO. Est-il disponible ?`;
    const url = `https://wa.me/221772771917?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté.`,
      className: "bg-[#003D7A] text-white border-none",
    });
  };

  if (productsLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#003D7A] w-10 h-10" /></div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Helmet>
          <title>Produit introuvable - KAYJOKKO.com</title>
        </Helmet>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Produit introuvable</h2>
        <Button onClick={() => navigate('/products')} variant="outline">Retour aux produits</Button>
      </div>
    );
  }

  const allImages = product.allImages && product.allImages.length > 0 
    ? product.allImages.map(img => img.image_url) 
    : [product.image || '/placeholder.png'];

  return (
    <>
      <Helmet>
        <title>{product.name} - KAYJOKKO.com</title>
        <meta name="description" content={`Achetez ${product.name} au meilleur prix sur KAYJOKKO.com. ${product.description ? product.description.substring(0, 100) + '...' : 'La qualité au bon prix.'}`} />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 pb-20 pt-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-[#003D7A] mb-8 font-medium transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Retour
          </button>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              
              {/* Gallery Section */}
              <div className="p-8 bg-white border-b lg:border-b-0 lg:border-r border-gray-100">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4 border border-gray-100">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={activeImage}
                      src={activeImage}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="w-full h-full object-contain p-4"
                      alt={product.name}
                    />
                  </AnimatePresence>
                  {product.is_promo && (
                     <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                       PROMO
                     </div>
                  )}
                </div>

                {/* Thumbnails */}
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {allImages.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === img ? 'border-[#003D7A] ring-2 ring-[#003D7A]/20' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`Vue ${idx+1}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Section */}
              <div className="p-8 lg:p-12 flex flex-col">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                   <span className="bg-blue-50 text-[#003D7A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                     {product.categoryName}
                   </span>
                   {product.subcategoryName && (
                     <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wider">
                       {product.subcategoryName}
                     </span>
                   )}
                   {product.stock > 0 ? (
                     <span className="text-green-600 text-xs font-bold flex items-center gap-1 ml-auto">
                       <div className="w-2 h-2 rounded-full bg-green-500" /> En Stock
                     </span>
                   ) : (
                     <span className="text-red-500 text-xs font-bold flex items-center gap-1 ml-auto">
                       <div className="w-2 h-2 rounded-full bg-red-500" /> Rupture
                     </span>
                   )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                <div className="flex items-end gap-4 mb-6">
                  <span className="text-3xl font-bold text-[#003D7A]">
                    {product.price.toLocaleString()} <span className="text-lg">FCFA</span>
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through mb-1">
                      {product.originalPrice.toLocaleString()} F
                    </span>
                  )}
                </div>

                <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
                  <p>{product.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <Button 
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 h-14 text-base font-bold bg-[#003D7A] hover:bg-[#002a54] shadow-lg shadow-blue-900/10"
                  >
                    <ShoppingCart className="mr-2" /> AJOUTER AU PANIER
                  </Button>
                  <Button 
                    onClick={handleWhatsAppOrder}
                    variant="outline"
                    className="flex-1 h-14 text-base font-bold border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all"
                  >
                    <MessageCircle className="mr-2" /> COMMANDER VIA WHATSAPP
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#003D7A]">
                      <Truck size={20} />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-gray-900">Livraison Rapide</p>
                      <p className="text-gray-500">Partout au Sénégal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#003D7A]">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-gray-900">Garantie Qualité</p>
                      <p className="text-gray-500">Produits authentiques</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews & Related */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2">
               <h3 className="text-xl font-bold text-gray-900 mb-6">Avis Clients</h3>
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center py-12">
                 <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Star className="text-gray-300" />
                 </div>
                 <p className="text-gray-500">Il n'y a pas encore d'avis pour ce produit.</p>
                 <Button variant="link" className="text-[#003D7A]">Soyez le premier à donner votre avis</Button>
               </div>
             </div>
             
             <div>
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Produits Similaires</h3>
                  <Button 
                    variant="link" 
                    className="text-sm text-[#003D7A] p-0 h-auto"
                    onClick={() => navigate('/products')}
                  >
                    Voir plus
                  </Button>
               </div>
               
               <div className="space-y-4">
                 {relatedProducts.length > 0 ? (
                   relatedProducts.map(rel => (
                     <div 
                       key={rel.id} 
                       onClick={() => navigate(`/product/${rel.id}`)}
                       className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                     >
                       <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                         <img src={rel.image || '/placeholder.png'} className="w-full h-full object-contain p-1" alt={rel.name} />
                       </div>
                       <div>
                         <h4 className="font-bold text-sm text-gray-800 line-clamp-1 group-hover:text-[#003D7A]">{rel.name}</h4>
                         <span className="text-[#003D7A] font-bold text-sm">{rel.price.toLocaleString()} F</span>
                       </div>
                     </div>
                   ))
                 ) : (
                   <p className="text-gray-400 text-sm">Aucun produit similaire.</p>
                 )}
               </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;