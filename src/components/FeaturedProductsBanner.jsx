import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorageProducts } from '@/hooks/useLocalStorageProducts';
import { ChevronLeft, ChevronRight, PackageOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function FeaturedProductsBanner() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const products = useLocalStorageProducts();
  const featured = products.slice(0, 10);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -200 : 200;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (featured.length === 0) {
    return (
      <div className="bg-[#003D7A] py-6 text-white text-center">
        <div className="flex flex-col items-center justify-center gap-2 opacity-70">
           <PackageOpen size={24} />
           <p className="text-sm">Aucun produit en vedette pour le moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#003D7A] py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4 text-white">
          <h2 className="text-[16px] font-bold">Produits en vedette</h2>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="p-1 hover:bg-white/10 rounded-full">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} className="p-1 hover:bg-white/10 rounded-full">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featured.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(`/product/${product.id}`)}
              className="flex-shrink-0 w-[100px] cursor-pointer snap-start flex flex-col items-center"
            >
              <div className="w-[100px] h-[100px] bg-white rounded-lg overflow-hidden mb-2">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-white text-[11px] text-center line-clamp-2 leading-tight w-full">
                {product.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturedProductsBanner;