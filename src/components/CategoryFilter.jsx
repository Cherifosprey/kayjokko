import React, { useState, useEffect } from 'react';
import { Filter, ChevronRight, Check } from 'lucide-react';
import { categories as initialCategories, subscribeToCategories } from '@/data/categoriesData';
import { supabase } from '@/lib/customSupabaseClient';

const CategoryFilter = ({ activeCategory, activeSubcategory, onCategoryChange, onSubcategoryChange }) => {
  const [localCategories, setLocalCategories] = useState(initialCategories);

  useEffect(() => {
    // Fetch and display subcategories from DB
    const fetchRealtime = async () => {
      const { data: dbCategories } = await supabase.from('kayjoko_categories').select('*');
      const { data: dbSubcategories } = await supabase.from('kayjoko_subcategories').select('*');
      
      if (dbCategories && dbSubcategories) {
         const updatedCategories = initialCategories.map(cat => {
            const dbCat = dbCategories.find(c => c.name.toLowerCase() === cat.name.toLowerCase());
            let subs = cat.subcategories;
            if (dbCat) {
               const matchingSubs = dbSubcategories.filter(s => s.category_id === dbCat.id);
               if (matchingSubs.length > 0) {
                 subs = matchingSubs.map(s => ({ id: s.id, name: s.name }));
               }
            }
            return { ...cat, subcategories: subs };
         });
         setLocalCategories(updatedCategories);
      }
    };
    
    fetchRealtime();

    const unsubscribe = subscribeToCategories((newCats) => {
      setLocalCategories(newCats);
    });
    
    // Subscribe to realtime changes in DB
    const channel = supabase.channel('subcategories_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kayjoko_subcategories' }, payload => {
         fetchRealtime();
      })
      .subscribe();

    return () => {
      unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCategoryClick = (catName) => {
    onCategoryChange(catName);
    onSubcategoryChange('');
  };

  const handleSubcategoryClick = (subName) => {
    onSubcategoryChange(subName);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit mb-6">
      <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-4">
        <Filter size={20} className="text-[#003D7A]" /> 
        Catégories
      </h3>

      <div className="space-y-1">
        <button
          onClick={() => { onCategoryChange('all'); onSubcategoryChange(''); }}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
            activeCategory === 'all' || !activeCategory ? 'bg-blue-50 text-[#003D7A] font-bold' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Toutes les catégories
          {(activeCategory === 'all' || !activeCategory) && <Check size={16} />}
        </button>

        {localCategories.map(cat => (
          <div key={cat.id}>
            <button
              onClick={() => handleCategoryClick(cat.name)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                activeCategory === cat.name ? 'bg-blue-50 text-[#003D7A] font-bold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.name}
              {activeCategory === cat.name && <ChevronRight size={16} />}
            </button>
            
            {activeCategory === cat.name && cat.subcategories.length > 0 && (
              <div className="ml-4 mt-1 space-y-1 pl-3 border-l-2 border-blue-100">
                <button
                  onClick={() => handleSubcategoryClick('')}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                    !activeSubcategory ? 'text-[#003D7A] font-bold' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Tout voir
                </button>
                {cat.subcategories.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => handleSubcategoryClick(sub.name)}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                      activeSubcategory === sub.name ? 'text-[#003D7A] font-bold bg-blue-50/50' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;