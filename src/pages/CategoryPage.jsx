import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Filter, PackageX, Loader2, RotateCcw } from 'lucide-react';
import { useKayjokoProducts } from '@/hooks/useKayjokoProducts';
import { applyAllFilters } from '@/hooks/useProductFiltering';
import { categories } from '@/data/categoriesData';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import { Button } from '@/components/ui/button';

function CategoryPage() {
  const { categoryName } = useParams();
  const decodedCategoryName = decodeURIComponent(categoryName || '');
  const navigate = useNavigate();
  
  const matchedCategory = categories.find(c => c.name === decodedCategoryName) || { name: decodedCategoryName, emoji: '📦', subcategories: [] };
  
  const { products, loading, error, refetch } = useKayjokoProducts(true);

  const [filters, setFilters] = useState({
    category: decodedCategoryName,
    minPrice: 0,
    maxPrice: 2000000,
    brands: [],
    minRating: 0,
    subcategory: null
  });

  const [sortOption, setSortOption] = useState('relevance');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    setFilters(prev => ({ ...prev, category: decodedCategoryName, subcategory: null }));
    setCurrentPage(1);
  }, [decodedCategoryName]);

  const filteredProducts = applyAllFilters(products || [], filters);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    if (sortOption === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // relevance
  });
  
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const pageTitle = matchedCategory.name ? `${matchedCategory.name} - KAYJOKKO.com` : 'Catalogue Complet - KAYJOKKO.com';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-6 py-6">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Link to="/" className="hover:text-[#003D7A]">Accueil</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="font-medium text-gray-900 capitalize">{matchedCategory.name}</span>
            </div>
            <div className="flex items-center gap-4 mt-4">
               {matchedCategory.emoji && <span className="text-5xl">{matchedCategory.emoji}</span>}
               <div>
                  <h1 className="text-3xl font-bold text-[#003D7A] capitalize">
                      {matchedCategory.name}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                      {sortedProducts.length} produits disponibles
                  </p>
               </div>
            </div>
            
            {matchedCategory.subcategories?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                  {matchedCategory.subcategories.map(sub => (
                      <button
                          key={sub.id}
                          onClick={() => navigate(`/category/${encodeURIComponent(matchedCategory.name)}/${encodeURIComponent(sub.name)}`)}
                          className="px-4 py-2 bg-gray-100 hover:bg-[#003D7A] hover:text-white rounded-full text-xs font-medium transition-all duration-300 border border-gray-200"
                      >
                          {sub.name}
                      </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <FilterSidebar 
              filters={filters} 
              onFilterChange={handleFilterChange}
              mobileOpen={mobileFiltersOpen}
              onClose={() => setMobileFiltersOpen(false)}
            />

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between mb-6 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <Button 
                  variant="outline" 
                  className="lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <Filter className="w-4 h-4 mr-2" /> Filtres
                </Button>

                <div className="flex items-center gap-2 ml-auto">
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
                    <option value="rating">Meilleures notes</option>
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
              ) : currentProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence mode='wait'>
                    {currentProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        layout
                        transition={{ duration: 0.2 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <PackageX className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Aucun produit trouvé</h3>
                  <p className="text-gray-500 mt-2 max-w-md">
                    Il n'y a pas encore de produits correspondant à vos filtres.
                  </p>
                  <Button 
                    variant="link" 
                    onClick={() => handleFilterChange({...filters, minPrice: 0, maxPrice: 2000000, brands: [], minRating: 0, subcategory: null})}
                    className="mt-4 text-[#003D7A]"
                  >
                    Effacer les filtres
                  </Button>
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                          setCurrentPage(i + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                        currentPage === i + 1
                          ? 'bg-[#003D7A] text-white shadow-md'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryPage;