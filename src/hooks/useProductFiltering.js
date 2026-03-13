export const filterProductsBySearch = (products, searchQuery) => {
  if (!searchQuery) return products;
  const lowerQuery = searchQuery.toLowerCase();
  return products.filter(p => 
    p.name?.toLowerCase().includes(lowerQuery) || 
    p.description?.toLowerCase().includes(lowerQuery)
  );
};

export const filterProductsByPrice = (products, minPrice, maxPrice) => {
  return products.filter(p => {
    const price = Number(p.price) || 0;
    const min = minPrice ?? 0;
    const max = maxPrice ?? Infinity;
    return price >= min && price <= max;
  });
};

export const filterProductsByBrand = (products, brands) => {
  if (!brands || brands.length === 0) return products;
  return products.filter(p => p.brand && brands.includes(p.brand));
};

export const filterProductsByRating = (products, minRating) => {
  if (!minRating || minRating <= 0) return products;
  return products.filter(p => (p.rating || 0) >= minRating);
};

export const filterProductsByCategory = (products, categoryId) => {
  if (!categoryId || categoryId === 'all') return products;
  return products.filter(p => p.category_id === categoryId || p.category?.name === categoryId);
};

export const filterProductsBySubcategory = (products, subcategoryId) => {
  if (!subcategoryId || subcategoryId === 'all') return products;
  return products.filter(p => p.subcategory_id === subcategoryId || p.subcategory?.name === subcategoryId || p.subcategoryName === subcategoryId);
};

export const applyAllFilters = (products, filters) => {
  if (!products) return [];
  
  let result = [...products];

  // Apply Category
  if (filters.category) {
    result = filterProductsByCategory(result, filters.category);
  }
  
  // Apply Subcategory
  if (filters.subcategory) {
    result = filterProductsBySubcategory(result, filters.subcategory);
  }

  // Apply Search
  if (filters.search) {
    result = filterProductsBySearch(result, filters.search);
  }

  // Apply Price
  if (filters.priceRange) {
    result = filterProductsByPrice(result, filters.priceRange[0], filters.priceRange[1]);
  } else if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    result = filterProductsByPrice(result, filters.minPrice, filters.maxPrice);
  }

  // Apply Brand
  if (filters.brands && filters.brands.length > 0) {
    result = filterProductsByBrand(result, filters.brands);
  }

  // Apply Rating
  if (filters.minRating) {
    result = filterProductsByRating(result, filters.minRating);
  }

  // Apply Stock
  if (filters.inStock) {
    result = result.filter(p => (p.stock || 0) > 0);
  }

  return result;
};