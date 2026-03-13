import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/use-toast';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleNavigate = () => {
    navigate(`/product/${product.id}`);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté.`,
      className: "bg-[#003D7A] text-white border-none",
    });
  };

  // Determine which image to show
  const displayImage = product.images && product.images.length > 0 ? product.images[0] : product.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl group cursor-pointer border border-gray-100 h-full flex flex-col"
      onClick={handleNavigate}
    >
      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
        />
        {product.categoryName && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-black px-2 py-1 rounded text-[10px] font-bold shadow-sm z-10 uppercase tracking-wide">
            {product.categoryName}
            </div>
        )}
        {product.badge && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold shadow-sm z-10 uppercase tracking-wide">
            {product.badge}
            </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button className="bg-white text-[#003D7A] hover:bg-[#003D7A] hover:text-white rounded-full shadow-lg">
                <Eye className="w-5 h-5 mr-2" />
                Voir détails
            </Button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#003D7A] transition-colors min-h-[40px]">
          {product.name}
        </h3>
        
        <p className="text-gray-500 text-xs mb-4 line-clamp-2 min-h-[32px]">
          {product.description || "Aucune description"}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
              <span className="text-lg font-bold text-[#003D7A]">
                {Number(product.price).toLocaleString()} F
              </span>
              {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                      {Number(product.originalPrice).toLocaleString()} F
                  </span>
              )}
          </div>
          
          <Button
            onClick={handleQuickAdd}
            size="icon"
            className="bg-[#003D7A] hover:bg-[#002a54] text-white rounded-lg w-10 h-10 shadow-sm"
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;