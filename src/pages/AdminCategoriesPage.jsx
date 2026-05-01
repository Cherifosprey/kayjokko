import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient.js';
import { Plus, Edit, Trash2, Folder, ListTree, X, Loader2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour la modale (fenêtre popup)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('category'); // 'category' ou 'subcategory'
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);

  // États du formulaire
  const [formData, setFormData] = useState({ name: '', category_id: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Charger les données au montage
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // On récupère les catégories
      const { data: catData, error: catError } = await supabase
        .from('kayjoko_categories')
        .select('*')
        .order('name');
      if (catError) throw catError;

      // On récupère les sous-catégories avec le nom de leur catégorie parente
      const { data: subData, error: subError } = await supabase
        .from('kayjoko_subcategories')
        .select('*, category:kayjoko_categories(name)')
        .order('name');
      if (subError) throw subError;

      setCategories(catData || []);
      setSubcategories(subData || []);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
      alert("Impossible de charger les catégories.");
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir la modale pour l'ajout
  const openAddModal = (type) => {
    setModalType(type);
    setIsEditing(false);
    setCurrentItemId(null);
    setFormData({ name: '', category_id: categories.length > 0 ? categories[0].id : '' });
    setIsModalOpen(true);
  };

  // Ouvrir la modale pour l'édition
  const openEditModal = (type, item) => {
    setModalType(type);
    setIsEditing(true);
    setCurrentItemId(item.id);
    setFormData({ 
      name: item.name, 
      category_id: type === 'subcategory' ? item.category_id : '' 
    });
    setIsModalOpen(true);
  };

  // Sauvegarder (Ajout ou Modification)
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const table = modalType === 'category' ? 'kayjoko_categories' : 'kayjoko_subcategories';
    const payload = modalType === 'category' 
      ? { name: formData.name } 
      : { name: formData.name, category_id: formData.category_id };

    try {
      if (isEditing) {
        const { error } = await supabase.from(table).update(payload).eq('id', currentItemId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table).insert([payload]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchData(); // Rafraîchir les listes
    } catch (error) {
      console.error("Erreur de sauvegarde :", error);
      alert("Une erreur est survenue lors de la sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  };

  // Supprimer un élément
  const handleDelete = async (type, id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;

    const table = type === 'category' ? 'kayjoko_categories' : 'kayjoko_subcategories';
    
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Erreur de suppression :", error);
      alert("Impossible de supprimer. Vérifiez qu'aucun produit n'est lié à cet élément.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Catégories</h1>
        <p className="text-gray-600 mt-2">Organisez la structure de votre catalogue Kayjokko.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- SECTION CATÉGORIES --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Catégories Principales</h2>
            </div>
            <button 
              onClick={() => openAddModal('category')}
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>
          
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {categories.length === 0 ? (
              <p className="p-5 text-center text-gray-500">Aucune catégorie trouvée.</p>
            ) : (
              categories.map(cat => (
                <div key={cat.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <span className="font-medium text-gray-700">{cat.name}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal('category', cat)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete('category', cat.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- SECTION SOUS-CATÉGORIES --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div className="flex items-center gap-2">
              <ListTree className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold">Sous-Catégories</h2>
            </div>
            <button 
              onClick={() => openAddModal('subcategory')}
              className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>

          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {subcategories.length === 0 ? (
              <p className="p-5 text-center text-gray-500">Aucune sous-catégorie trouvée.</p>
            ) : (
              subcategories.map(sub => (
                <div key={sub.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-700">{sub.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Dossier : {sub.category?.name || 'Inconnu'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal('subcategory', sub)} className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete('subcategory', sub.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* --- MODALE AJOUT / ÉDITION --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-semibold text-lg">
                {isEditing ? 'Modifier' : 'Ajouter'} {modalType === 'category' ? 'une Catégorie' : 'une Sous-catégorie'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder={modalType === 'category' ? 'Ex: Électronique' : 'Ex: Smartphones'}
                  />
                </div>

                {/* Sélecteur de catégorie parente (uniquement pour les sous-catégories) */}
                {modalType === 'subcategory' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie Parente</label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="" disabled>Sélectionnez une catégorie...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}