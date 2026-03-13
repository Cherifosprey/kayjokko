import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronLeft, ChevronRight, Loader2, RotateCcw } from 'lucide-react';
import { useKayjokoProducts } from '@/hooks/useKayjokoProducts';
import { applyAllFilters } from '@/hooks/useProductFiltering';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import CategoryFilter from '@/components/CategoryFilter';
import { seoPages } from '@/utils/seoConfig';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [filters, setFilters] = useState({
    priceRange: [0, 2000000],
    inStock: false,
    search: initialSearch,
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    if (initialSearch !== filters.search) {
      setFilters(prev => ({ ...prev, search: initialSearch }));
    }
  }, [initialSearch]);

  const { products, loading, error, refetch } = useKayjokoProducts(true);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, selectedCategory, selectedSubcategory]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return applyAllFilters(products, {
      ...filters,
      category: selectedCategory,
      subcategory: selectedSubcategory
    });
  }, [products, filters, selectedCategory, selectedSubcategory]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Helmet>
        <title>{seoPages.products.title}</title>
        <meta name="description" content={seoPages.products.description} />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-gradient-to-r from-[#003D7A] to-[#001a33] h-[200px] flex flex-col items-center justify-center text-white px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-2"
          >
            NOS PRODUITS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-blue-100 text-lg"
          >
            Découvrez notre large gamme de produits de qualité sur KAYJOKKO
          </motion.p>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
          <div className="md:hidden mb-4">
            <button 
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="w-full flex items-center justify-center gap-2 bg-white p-3 rounded-lg shadow border border-gray-200 text-[#003D7A] font-semibold"
            >
              <Filter size={20} />
              {showFiltersMobile ? 'Masquer les filtres' : 'Afficher les filtres'}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <aside className={`md:w-1/4 ${showFiltersMobile ? 'block' : 'hidden md:block'} space-y-6`}>
              <CategoryFilter 
                activeCategory={selectedCategory} 
                activeSubcategory={selectedSubcategory}
                onCategoryChange={setSelectedCategory}
                onSubcategoryChange={setSelectedSubcategory}
              />
              <ProductFilters onFilterChange={setFilters} initialFilters={filters} />
            </aside>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {filteredProducts.length} produits trouvés
                </h2>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                  <Loader2 className="w-12 h-12 text-[#003D7A] animate-spin mb-4" />
                  <p className="text-gray-500">Chargement des produits...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-red-200">
                  <RotateCcw className="w-12 h-12 text-red-500 mb-4" />
                  <p className="text-red-500 font-medium mb-4">Erreur lors du chargement des produits.</p>
                  <button onClick={refetch} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100">
                    Réessayer
                  </button>
                </div>
              ) : currentProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {currentProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                           <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center items-center gap-4">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="font-medium text-gray-600">
                        Page {currentPage} sur {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                  <Search className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun produit trouvé</h3>
                  <p className="text-gray-500 mb-6 text-center max-w-md">
                    Nous n'avons trouvé aucun produit correspondant à vos critères. Essayez de modifier vos filtres.
                  </p>
                  <button 
                    onClick={() => {
                      setFilters({priceRange: [0, 2000000], inStock: false, search: ''});
                      setSearchParams({});
                      setSelectedCategory('all');
                      setSelectedSubcategory('');
                    }}
                    className="px-6 py-2 bg-[#003D7A] text-white rounded-lg font-bold hover:bg-[#002855] transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;