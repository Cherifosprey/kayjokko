import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Save, X, List } from 'lucide-react';
import AdminHeader from '@/components/AdminHeader';
import { supabase } from '@/lib/customSupabaseClient.js';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSubcategoriesManager from '@/components/AdminSubcategoriesManager';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const { toast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('kayjoko_categories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    setEditingCategory(category);
    setFormData({
      name: category ? category.name : '',
      description: category ? category.description || '' : ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('kayjoko_categories')
          .update(formData)
          .eq('id', editingCategory.id);
        if (error) throw error;
        toast({ title: 'Succès', description: 'Catégorie mise à jour' });
      } else {
        const { error } = await supabase
          .from('kayjoko_categories')
          .insert(formData);
        if (error) throw error;
        toast({ title: 'Succès', description: 'Catégorie créée' });
      }
      closeModal();
      fetchCategories();
    } catch (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Attention : Supprimer une catégorie supprimera aussi toutes ses sous-catégories. Continuer ?")) return;

    const { error } = await supabase
      .from('kayjoko_categories')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Succès', description: 'Catégorie supprimée' });
      fetchCategories();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdminHeader />
      
      <main className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestion des Catégories</h2>
            <p className="text-gray-500">Gérez les catégories et sous-catégories de votre boutique</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-[#4CAF50] hover:bg-[#43a047] text-white px-6 py-3 rounded-lg font-bold shadow-md transition-all active:scale-95"
          >
            <Plus size={20} />
            NOUVELLE CATÉGORIE
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-12 h-12 animate-spin text-gray-400" /></div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow border border-gray-100">
            <List className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune catégorie trouvée.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">Nom</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Description</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{cat.description || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(cat)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier / Gérer sous-catégories"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                </h3>
                <button onClick={closeModal}><X className="text-gray-500 hover:text-gray-700" /></button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <form id="catForm" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                    <input 
                      type="text" 
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003D7A] outline-none"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      rows="3"
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003D7A] outline-none"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  
                  {/* Subcategories Manager - Only shown when editing existing category */}
                  {editingCategory && (
                    <AdminSubcategoriesManager categoryId={editingCategory.id} />
                  )}
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                 <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg">Annuler</button>
                 <button type="submit" form="catForm" className="px-4 py-2 bg-[#003D7A] text-white font-bold rounded-lg hover:bg-[#002a54] flex items-center gap-2">
                   <Save size={18} /> Enregistrer
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategoriesPage;