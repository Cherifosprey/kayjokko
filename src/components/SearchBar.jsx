import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      onSubmit={handleSearch}
      className="relative w-full max-w-xl mx-auto"
    >
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Chercher des produits..."
          className="w-full h-14 pl-6 pr-16 rounded-full border-2 border-transparent bg-white/95 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-kayjoko-blue focus:ring-4 focus:ring-kayjoko-blue/20 transition-all duration-300 shadow-xl text-lg"
        />
        <button
          type="submit"
          className="absolute right-2 h-10 w-10 bg-[#003D7A] text-white rounded-full flex items-center justify-center hover:bg-[#002855] hover:scale-105 transition-all duration-300 shadow-md"
          aria-label="Rechercher"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </motion.form>
  );
}

export default SearchBar;