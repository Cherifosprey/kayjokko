import { useState, useEffect } from 'react';

export const useLocalStorageProducts = () => {
  const [products, setProducts] = useState([]);

  const loadProducts = () => {
    try {
      const stored = localStorage.getItem('kayjoko_products');
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        // Initialize with empty array if nothing exists
        const empty = [];
        // We don't necessarily want to write to LS here if we want the init utility to handle it,
        // but it's safe to return empty array.
        setProducts(empty);
      }
    } catch (error) {
      console.error("Failed to load products from localStorage", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    // Initial load
    loadProducts();

    // Listen for storage events (changes from other tabs)
    window.addEventListener('storage', loadProducts);
    
    // Listen for custom events (changes from this tab)
    window.addEventListener('kayjoko_products_updated', loadProducts);

    return () => {
      window.removeEventListener('storage', loadProducts);
      window.removeEventListener('kayjoko_products_updated', loadProducts);
    };
  }, []);

  return products;
};