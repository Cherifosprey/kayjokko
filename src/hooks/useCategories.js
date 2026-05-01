import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient.js';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // 1. Récupérer les catégories
      const { data: catData, error: catError } = await supabase
        .from('kayjoko_categories')
        .select('*')
        .order('name');

      if (catError) throw catError;

      // 2. Récupérer les sous-catégories
      const { data: subData, error: subError } = await supabase
        .from('kayjoko_subcategories')
        .select('*')
        .order('name');

      if (subError) throw subError;

      // 3. Formater les données pour qu'elles correspondent à la structure attendue par ton site
      const formattedCategories = (catData || []).map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: 'Folder', // Icône par défaut si tu utilises Lucide React
        subcategories: (subData || [])
          .filter(sub => sub.category_id === cat.id)
          .map(sub => sub.name)
      }));

      setCategories(formattedCategories);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();

    // Écouter les changements en temps réel (si tu ajoutes une catégorie depuis l'admin)
    const catSubscription = supabase
      .channel('public:kayjoko_categories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kayjoko_categories' }, fetchCategories)
      .subscribe();

    const subcatSubscription = supabase
      .channel('public:kayjoko_subcategories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kayjoko_subcategories' }, fetchCategories)
      .subscribe();

    return () => {
      supabase.removeChannel(catSubscription);
      supabase.removeChannel(subcatSubscription);
    };
  }, []);

  return { categories, loading, refetch: fetchCategories };
};