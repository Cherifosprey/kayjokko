import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Filter, PackageX, Loader2, RotateCcw } from 'lucide-react';
import { useKayjokoProducts } from '@/hooks/useKayjokoProducts';
import { applyAllFilters } from '@/hooks/useProductFiltering';
import { categories } from '@/data/categoriesData';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

function SubcategoryPage() {
  const { categoryName, subcategoryName } = useParams();
  const decodedCategoryName = decodeURIComponent(categoryName || '');
  const decodedSubcategoryName = decodeURIComponent(subcategoryName || '');
  
  const matchedCategory = categories.find(c => c.name === decodedCategoryName) || { name: decodedCategoryName, emoji: '📦', subcategories: [] };
  const matchedSubcategory = matchedCategory.subcategories?.find(s => s.name === decodedSubcategoryName) || { name: decodedSubcategoryName };
  const displaySubName = matchedSubcategory.name;

  const { products, loading, error, refetch } = useKayjokoProducts(true);
  
  const [filters, setFilters] = useState({
    category: decodedCategoryName,
    subcategory: decodedSubcategoryName,
    minPrice: 0,
    maxPrice: 2000000,
    brands: [],
  });

  useEffect(() => {
    setFilters(prev => ({ 
      ...prev, 
      category: decodedCategoryName, 
      subcategory: decodedSubcategoryName 
    }));
  }, [decodedCategoryName, decodedSubcategoryName]);
  
  const [sortOption, setSortOption] = useState('relevance');

  const filteredProducts = applyAllFilters(products || [], filters);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    return 0; // relevance
  });

  return (
    <>
      <Helmet>
        <title>{displaySubName} | {matchedCategory.name} - KAYJOKKO.com</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-6 py-4">
            <div className="flex items-center text-sm text-gray-500 mb-2 flex-wrap">
              <Link to="/" className="hover:text-[#003D7A]">Accueil</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <Link to={`/category/${encodeURIComponent(matchedCategory.name)}`} className="hover:text-[#003D7A]">{matchedCategory.name}</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="font-medium text-gray-900">{displaySubName}</span>
            </div>
            <h1 className="text-3xl font-bold text-[#003D7A] flex items-center gap-3">
               <span className="text-4xl">{matchedCategory.emoji}</span> {displaySubName}
            </h1>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
             <div className="flex items-center gap-2">
               <Filter className="w-5 h-5 text-gray-400" />
               <span className="font-semibold text-gray-700">{sortedProducts.length} produits trouvés</span>
             </div>

             <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:inline">Trier par:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#003D7A] focus:border-[#003D7A] block p-2.5 outline-none"
              >
                <option value="relevance">Pertinence</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="newest">Nouveautés</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <Loader2 className="w-12 h-12 text-[#003D7A] animate-spin mb-4" />
              <p className="text-gray-500">Chargement des produits...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-red-200">
              <RotateCcw className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-500 font-medium mb-4">Erreur lors du chargement.</p>
              <Button variant="outline" onClick={refetch}>Réessayer</Button>
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode='wait'>
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    layout
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 flex flex-col items-center">
              <PackageX className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Aucun produit trouvé</h3>
              <p className="text-gray-500 mt-2">Désolé, nous n'avons pas encore de stock pour cette sous-catégorie sur KAYJOKKO.</p>
              <Button onClick={() => window.history.back()} className="mt-4 bg-[#003D7A]">
                Retour
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SubcategoryPage;