import { categories } from './categoriesData';

// Initialize with an empty products array as requested
export const products = [];

// Helper functions working with empty array
export const getProductById = (id) => products.find(p => p.id === parseInt(id));

export const getProductsByCategory = (categoryId) => {
    if (!categoryId || categoryId === 'all') return products;
    return products.filter(p => p.category === categoryId);
};

export const getProductsBySubcategory = (subcategory) => {
    if (!subcategory) return [];
    return products.filter(p => p.subcategory === subcategory);
};

export const filterProducts = (prods, filters) => {
    if (!prods) return [];
    return prods.filter(p => 
        (!filters.minPrice || p.price >= filters.minPrice) &&
        (!filters.maxPrice || p.price <= filters.maxPrice) &&
        (!filters.brands?.length || filters.brands.includes(p.brand)) &&
        (!filters.subcategory || p.subcategory === filters.subcategory)
    );
};

export const sortProducts = (prods, sort) => {
  if (!prods) return [];
  const sorted = [...prods];
  if(sort === 'price-asc') return sorted.sort((a,b) => a.price - b.price);
  if(sort === 'price-desc') return sorted.sort((a,b) => b.price - a.price);
  if(sort === 'newest') return sorted.sort((a,b) => (b.badge === 'NOUVEAU' ? 1 : 0) - (a.badge === 'NOUVEAU' ? 1 : 0));
  return sorted;
};

export const getAllBrands = () => [...new Set(products.map(p => p.brand))];
export const getAllCategories = () => categories;