import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Folder } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCategories } from '@/hooks/useCategories'; // 🟢 NOUVEL IMPORT

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartCount();
  const logoUrl = "https://horizons-cdn.hostinger.com/3ce8dc60-b7b9-4247-9062-c4256906ec88/cd9315c19120632cfaec726c40b67aec.jpg";

  // 🟢 NOUVEAU : Récupération dynamique depuis Supabase
  const { categories = [] } = useCategories();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/category/all?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const chunkCategories = () => {
    if (!categories.length) return [];
    const colSize = Math.ceil(categories.length / 4) || 1;
    return [
      categories.slice(0, colSize),
      categories.slice(colSize, colSize * 2),
      categories.slice(colSize * 2, colSize * 3),
      categories.slice(colSize * 3)
    ];
  };

  const columns = chunkCategories();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#003D7A] text-white sticky top-0 z-50 shadow-md font-sans"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-6">
          
          <Link to="/" className="shrink-0 hover:opacity-90 transition-opacity">
            <img 
              src={logoUrl} 
              alt="KAYJOKKO.com Logo" 
              className="w-[120px] lg:w-[150px] rounded"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8 font-medium text-[13px] relative">
            <Link to="/" className="hover:text-gray-200 transition-colors">ACCUEIL</Link>
            
            <div 
              className="group"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button 
                className={`flex items-center gap-1 hover:text-gray-200 transition-colors py-4 ${isMegaMenuOpen ? 'text-white' : ''}`}
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                aria-expanded={isMegaMenuOpen}
              >
                CATÉGORIES <ChevronDown size={14} className={`transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isMegaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-[-200px] w-[1000px] bg-white text-gray-800 shadow-2xl rounded-xl p-6 border border-gray-100 z-50 max-h-[80vh] overflow-y-auto"
                  >
                    <div className="grid grid-cols-4 gap-8">
                      {columns.map((column, colIndex) => (
                        <div key={colIndex} className="flex flex-col gap-6">
                          {column.map((cat) => {
                            // 🟢 NOUVEAU : Sécurisation de l'icône
                            const Icon = (typeof cat.icon === 'function' || typeof cat.icon === 'object') ? cat.icon : Folder;
                            return (
                              <div key={cat.id} className="group/item">
                                <Link 
                                  to={`/category/${encodeURIComponent(cat.name)}`}
                                  className="flex items-center gap-3 mb-2 p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-50"
                                  onClick={() => setIsMegaMenuOpen(false)}
                                >
                                  <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Icon 
                                      size={24} 
                                      color={cat.color || "#003D7A"} 
                                      strokeWidth={2}
                                    />
                                  </motion.div>
                                  <span className="text-sm font-bold text-[#003D7A] group-hover/item:text-[#002855] transition-colors">
                                    {cat.name}
                                  </span>
                                </Link>
                                
                                {cat.subcategories && cat.subcategories.length > 0 && (
                                  <ul className="space-y-1 pl-[44px]">
                                    {cat.subcategories.slice(0, 4).map((sub, index) => {
                                      // 🟢 NOUVEAU : Adaptation format texte ou objet
                                      const subName = typeof sub === 'string' ? sub : sub.name;
                                      const subId = typeof sub === 'string' ? index : sub.id;
                                      
                                      return (
                                      <li key={subId}>
                                        <Link 
                                          to={`/category/${encodeURIComponent(cat.name)}/${encodeURIComponent(subName)}`}
                                          className="text-[11px] text-[#666] hover:text-[#FFA500] hover:underline transition-all duration-150 block py-0.5"
                                          onClick={() => setIsMegaMenuOpen(false)}
                                        >
                                          {subName}
                                        </Link>
                                      </li>
                                      )
                                    })}
                                    {cat.subcategories.length > 4 && (
                                      <li>
                                        <Link 
                                          to={`/category/${encodeURIComponent(cat.name)}`} 
                                          className="text-[10px] text-[#003D7A] font-bold hover:underline mt-1 block"
                                          onClick={() => setIsMegaMenuOpen(false)}
                                        >
                                          Voir tout ({cat.subcategories.length})
                                        </Link>
                                      </li>
                                    )}
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/contact" className="hover:text-gray-200 transition-colors">CONTACT</Link>
            <Link to="/products" className="hover:text-gray-200 transition-colors">PRODUITS</Link>
          </nav>

          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-6 relative">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full h-10 pl-4 pr-10 rounded-full text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#003D7A]">
              <Search className="w-5 h-5" />
            </button>
          </form>

          <div className="flex items-center gap-5">
            <Link to="/favorites" className="hidden md:flex hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </Link>
            <Link to="/admin/login" className="hidden md:flex hover:scale-110 transition-transform">
              <User className="w-6 h-6" />
            </Link>
            <Link to="/cart" className="relative hover:scale-110 transition-transform">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#EF4444] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#003D7A]">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[320px] bg-white text-black z-50 overflow-y-auto shadow-2xl"
            >
               <div className="p-5 flex justify-between items-center bg-[#003D7A] text-white sticky top-0 z-10">
                <span className="text-lg font-bold">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-5">
                <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="mb-6 relative">
                    <input 
                      type="text" 
                      placeholder="Rechercher..." 
                      className="w-full h-10 pl-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:border-[#003D7A]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <Search className="w-5 h-5" />
                    </button>
                </form>

                <nav className="space-y-4 font-medium text-base">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-gray-100 hover:text-[#003D7A] transition-colors">Accueil</Link>
                  <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-gray-100 hover:text-[#003D7A] transition-colors">Contact</Link>
                  <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-gray-100 hover:text-[#003D7A] transition-colors">Produits</Link>
                  
                  <div className="py-2 border-b border-gray-100">
                     <p className="text-[#003D7A] text-sm mb-3 uppercase font-bold flex items-center gap-2">
                       Catégories
                     </p>
                     <div className="flex flex-col gap-4">
                       {categories.map((cat) => {
                         const Icon = (typeof cat.icon === 'function' || typeof cat.icon === 'object') ? cat.icon : Folder;
                         return (
                           <div key={cat.id} className="group/mobile-item">
                              <Link 
                                to={`/category/${encodeURIComponent(cat.name)}`} 
                                onClick={() => setIsMobileMenuOpen(false)} 
                                className="flex items-center gap-3 text-gray-800 font-semibold py-1 hover:text-[#003D7A] transition-colors"
                              >
                                <Icon size={20} color={cat.color || "#003D7A"} />
                                <span className="text-sm">{cat.name}</span>
                              </Link>
                              {cat.subcategories && cat.subcategories.length > 0 && (
                                <div className="pl-8 flex flex-wrap gap-2 mt-2">
                                  {cat.subcategories.map((sub, index) => {
                                    const subName = typeof sub === 'string' ? sub : sub.name;
                                    const subId = typeof sub === 'string' ? index : sub.id;
                                    return (
                                    <Link 
                                      key={subId} 
                                      to={`/category/${encodeURIComponent(cat.name)}/${encodeURIComponent(subName)}`}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="text-[11px] text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100 hover:bg-[#003D7A] hover:text-white hover:border-[#003D7A] transition-colors"
                                    >
                                      {subName}
                                    </Link>
                                    )
                                  })}
                                </div>
                              )}
                           </div>
                         );
                       })}
                     </div>
                  </div>

                  <Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-gray-100 hover:text-[#003D7A] transition-colors">Favoris</Link>
                  <Link to="/admin/login" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 border-b border-gray-100 hover:text-[#003D7A] transition-colors">Mon Compte</Link>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;