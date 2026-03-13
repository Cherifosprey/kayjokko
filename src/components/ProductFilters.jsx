import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/lib/customSupabaseClient.js';

const ProductFilters = ({ onFilterChange, initialFilters }) => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 1000000], // 1M FCFA default max
    inStock: false,
    search: '',
    ...initialFilters
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('kayjoko_categories').select('id, name');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  // Debounce filter updates to parent
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange(filters);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters, onFilterChange]);

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    const resetState = {
      category: 'all',
      priceRange: [0, 1000000],
      inStock: false,
      search: ''
    };
    setFilters(resetState);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          <Filter size={20} className="text-[#003D7A]" /> 
          Filtres
        </h3>
        <button 
          onClick={handleReset}
          className="text-xs text-red-500 hover:text-red-600 hover:underline flex items-center gap-1"
        >
          <RotateCcw size={12} /> Réinitialiser
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Nom du produit..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003D7A] focus:outline-none transition-all"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
        <select 
          className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003D7A] outline-none bg-white text-sm"
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="all">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Prix</span>
          <span className="text-[#003D7A] font-bold text-xs bg-blue-50 px-2 py-1 rounded">
            {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()} FCFA
          </span>
        </div>
        <Slider 
          value={filters.priceRange} 
          min={0} 
          max={1000000} 
          step={5000} 
          onValueChange={(val) => handleChange('priceRange', val)}
          className="py-4"
        />
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input 
              type="checkbox" 
              checked={filters.inStock}
              onChange={(e) => handleChange('inStock', e.target.checked)}
              className="peer sr-only"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003D7A]"></div>
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-[#003D7A] transition-colors">
            En stock uniquement
          </span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;