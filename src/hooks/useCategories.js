import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient.js';
import { categories as fallbackCategories } from '@/data/categoriesData';

// Simple global cache to avoid excessive API calls
let cachedCategories = null;

export const useCategories = () => {
  const [categories, setCategories] = useState(cachedCategories || []);
  const [loading, setLoading] = useState(!cachedCategories);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we already have cached data, don't re-fetch immediately on every mount
    if (cachedCategories && cachedCategories.length > 0) {
      setCategories(cachedCategories);
      setLoading(false);
      return;
    }

    const fetchCategoriesData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch unique categories from products
        // Note: Supabase JS doesn't have a native .distinct() method for select,
        // so we fetch the relevant fields and deduplicate in JavaScript,
        // or we rely on the kayjoko_categories table which is the source of truth.
        // For robustness and linking to subcategories via ID, we fetch from kayjoko_categories,
        // but we ensure we get ALL of them as requested.
        const { data: dbCats, error: catError } = await supabase
          .from('kayjoko_categories')
          .select('*')
          .order('name');
        
        if (catError) throw catError;

        // 2. Fetch all subcategories
        const { data: dbSubcats, error: subError } = await supabase
          .from('kayjoko_subcategories')
          .select('*')
          .order('name');

        if (subError) throw subError;

        // 3. Map subcategories to their parent categories
        const structuredCategories = dbCats.map(cat => ({
          ...cat,
          subcategories: dbSubcats.filter(sub => sub.category_id === cat.id)
        }));

        // Cache the result
        cachedCategories = structuredCategories;
        setCategories(structuredCategories);

      } catch (err) {
        console.error('Error fetching categories from Supabase, using fallback:', err);
        setError(err.message);
        
        // Fallback to hardcoded categories if fetch fails
        const formattedFallback = fallbackCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          subcategories: (cat.subcategories || []).map(subName => ({
            id: `${cat.id}-${subName}`,
            name: subName,
            category_id: cat.id
          }))
        }));
        
        setCategories(formattedFallback);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesData();

    // Optional: Set up real-time subscription to update menu when categories change
    const categoriesSubscription = supabase
      .channel('categories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kayjoko_categories' }, () => {
        // Invalidate cache and refetch if there's a change
        cachedCategories = null;
        fetchCategoriesData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kayjoko_subcategories' }, () => {
        cachedCategories = null;
        fetchCategoriesData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(categoriesSubscription);
    };
  }, []);

  const getSubcategoriesByCategory = (categoryId) => {
    if (!categoryId) return [];
    const category = categories.find(c => c.id === categoryId);
    return category ? category.subcategories : [];
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  };

  return { 
    categories, 
    loading, 
    error, 
    getSubcategoriesByCategory,
    getCategoryName
  };
};