import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient.js';

export const useKayjokoProducts = (onlyActive = true, filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let allData = [];
      let from = 0;
      const step = 500;
      let hasMore = true;

      while (hasMore) {
        let query = supabase
          .from('kayjoko_products')
          .select(`
            *,
            category:kayjoko_categories(name, id),
            subcategory:kayjoko_subcategories(name, id),
            product_images:kayjoko_product_images(id, image_url, is_primary, display_order)
          `)
          .order('created_at', { ascending: false })
          .order('id', { ascending: true }) 
          .range(from, from + step - 1);

        if (onlyActive) {
          query = query.eq('is_active', true);
        }

        if (filters.category_id) {
          query = query.eq('category_id', filters.category_id);
        }
        if (filters.subcategory_id) {
          query = query.eq('subcategory_id', filters.subcategory_id);
        }

        const { data, fetchError } = await query;

        if (fetchError) throw fetchError;

        allData = [...allData, ...data];

        if (data.length < step) {
          hasMore = false;
        } else {
          from += step;
        }
      }

      const formattedData = allData.map(item => {
        const sortedImages = item.product_images 
          ? item.product_images.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          : [];
        
        const primaryImage = sortedImages.find(img => img.is_primary) || sortedImages[0];
        
        return {
          ...item,
          images: sortedImages.map(img => img.image_url),
          allImages: sortedImages,
          image: primaryImage ? primaryImage.image_url : (item.image_url || '/placeholder.png'),
          categoryName: item.category?.name || 'Uncategorized',
          subcategoryName: item.subcategory?.name || '',
          price: Number(item.price),
          originalPrice: item.original_price ? Number(item.original_price) : null,
          badge: item.is_promo ? (item.discount_badge || 'PROMO') : (item.stock <= 0 ? 'RUPTURE' : null)
        };
      });

      setProducts(formattedData);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    const subscription = supabase
      .channel('public:kayjoko_products_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kayjoko_products' }, fetchProducts)
      .subscribe();
      
    const imageSubscription = supabase
      .channel('public:kayjoko_product_images_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kayjoko_product_images' }, fetchProducts)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
      supabase.removeChannel(imageSubscription);
    };
  }, [onlyActive, filters.category_id, filters.subcategory_id]);

  return { products, loading, error, refetch: fetchProducts };
};