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
      const step = 1000;
      let hasMore = true;

      // Boucle pour récupérer au-delà de la limite des 1000 produits de Supabase
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
          .range(from, from + step - 1); // Pagination : de 'from' à 'from + 999'

        if (onlyActive) {
          query = query.eq('is_active', true);
        }

        // Apply server-side filters if provided
        if (filters.category_id) {
          query = query.eq('category_id', filters.category_id);
        }
        if (filters.subcategory_id) {
          query = query.eq('subcategory_id', filters.subcategory_id);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Ajouter les données récupérées à notre tableau global
        allData = [...allData, ...data];

        // S'il y a moins de 1000 éléments retournés, c'est qu'on a atteint la fin
        if (data.length < step) {
          hasMore = false;
        } else {
          // Sinon, on prépare l'index pour la requête suivante (ex: 1000, puis 2000...)
          from += step;
        }
      }

      // On formate la totalité des données récupérées
      const formattedData = allData.map(item => {
        // Sort images by display_order
        const sortedImages = item.product_images 
          ? item.product_images.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          : [];
        
        // Find primary image
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