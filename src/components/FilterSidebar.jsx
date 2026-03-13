import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Star, X } from 'lucide-react';
import { getAllBrands } from '@/data/productData';
import { motion, AnimatePresence } from 'framer-motion';

function FilterSidebar({ filters, onFilterChange, className, mobileOpen, onClose }) {
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 2000000]);
  const brands = getAllBrands();
  
  useEffect(() => {
    setPriceRange([filters.minPrice || 0, filters.maxPrice || 2000000]);
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handlePriceCommit = (value) => {
    onFilterChange({ ...filters, minPrice: value[0], maxPrice: value[1] });
  };

  const handleBrandChange = (brand, checked) => {
    const currentBrands = filters.brands || [];
    let newBrands;
    if (checked) {
      newBrands = [...currentBrands, brand];
    } else {
      newBrands = currentBrands.filter(b => b !== brand);
    }
    onFilterChange({ ...filters, brands: newBrands });
  };

  const handleRatingChange = (rating) => {
    // Toggle rating: if clicking the same rating, reset it
    const newRating = filters.minRating === rating ? 0 : rating;
    onFilterChange({ ...filters, minRating: newRating });
  };

  const handleReset = () => {
    onFilterChange({
      minPrice: 0,
      maxPrice: 2000000,
      brands: [],
      minRating: 0,
      category: filters.category // Keep category
    });
    setPriceRange([0, 2000000]);
  };

  const content = (
    <div className="space-y-8">
      {/* Header for mobile */}
      <div className="flex justify-between items-center lg:hidden mb-6">
        <h3 className="font-bold text-xl">Filtres</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Prix</h3>
        <Slider
          defaultValue={[0, 2000000]}
          value={priceRange}
          max={2000000}
          step={5000}
          onValueChange={handlePriceChange}
          onValueCommit={handlePriceCommit}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{priceRange[0].toLocaleString()} F</span>
          <span>{priceRange[1].toLocaleString()} F</span>
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Marques</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
          {brands.map(brand => (
            <div key={brand} className="flex items-center space-x-3">
              <Checkbox 
                id={`brand-${brand}`} 
                checked={filters.brands?.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked)}
              />
              <label 
                htmlFor={`brand-${brand}`} 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Avis Clients</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(star => (
            <button
              key={star}
              onClick={() => handleRatingChange(star)}
              className={`flex items-center w-full px-2 py-1 rounded-md transition-colors ${
                filters.minRating === star ? 'bg-blue-50 text-kayjoko-blue' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < star ? 'fill-current' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">& Plus</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <Button 
        variant="outline" 
        onClick={handleReset}
        className="w-full border-gray-300 hover:border-red-500 hover:text-red-500 hover:bg-red-50"
      >
        Réinitialiser les filtres
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block w-64 shrink-0 pr-8 border-r border-gray-100 ${className}`}>
        {content}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 p-6 overflow-y-auto shadow-xl lg:hidden"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default FilterSidebar;