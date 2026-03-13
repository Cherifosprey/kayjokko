import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient.js';
import { Plus, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminSubcategoriesManager = ({ categoryId }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const { toast } = useToast();

  const fetchSubcategories = async () => {
    if (!categoryId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('kayjoko_subcategories')
      .select('*')
      .eq('category_id', categoryId)
      .order('name');
    
    if (error) {
      console.error('Error fetching subcategories:', error);
      toast({ title: 'Erreur', description: "Impossible de charger les sous-catégories", variant: 'destructive' });
    } else {
      setSubcategories(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubcategories();
  }, [categoryId]);

  const handleAdd = async () => {
    if (!newSub.name.trim()) return;
    
    const { error } = await supabase
      .from('kayjoko_subcategories')
      .insert({
        category_id: categoryId,
        name: newSub.name,
        description: newSub.description
      });

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Succès', description: 'Sous-catégorie ajoutée' });
      setNewSub({ name: '', description: '' });
      setIsAdding(false);
      fetchSubcategories();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?')) return;

    const { error } = await supabase
      .from('kayjoko_subcategories')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Succès', description: 'Sous-catégorie supprimée' });
      fetchSubcategories();
    }
  };

  const startEdit = (sub) => {
    setEditingId(sub.id);
    setEditForm({ name: sub.name, description: sub.description || '' });
  };

  const saveEdit = async () => {
    const { error } = await supabase
      .from('kayjoko_subcategories')
      .update({
        name: editForm.name,
        description: editForm.description
      })
      .eq('id', editingId);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Succès', description: 'Sous-catégorie mise à jour' });
      setEditingId(null);
      fetchSubcategories();
    }
  };

  if (!categoryId) return <p className="text-gray-500 italic">Sélectionnez une catégorie pour gérer ses sous-catégories.</p>;

  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-gray-800">Sous-catégories ({subcategories.length})</h4>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="text-xs flex items-center gap-1 bg-blue-50 text-[#003D7A] px-2 py-1 rounded hover:bg-blue-100 font-bold"
          >
            <Plus size={14} /> Ajouter
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200">
          <input 
            type="text" 
            placeholder="Nom de la sous-catégorie" 
            className="w-full p-2 mb-2 rounded border border-gray-300 text-sm"
            value={newSub.name}
            onChange={e => setNewSub({...newSub, name: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Description (optionnel)" 
            className="w-full p-2 mb-2 rounded border border-gray-300 text-sm"
            value={newSub.description}
            onChange={e => setNewSub({...newSub, description: e.target.value})}
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsAdding(false)} className="text-xs px-3 py-1 text-gray-500">Annuler</button>
            <button onClick={handleAdd} className="text-xs px-3 py-1 bg-[#4CAF50] text-white rounded font-bold">Enregistrer</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-4"><Loader2 className="animate-spin text-gray-400" size={20} /></div>
      ) : subcategories.length === 0 ? (
        <p className="text-sm text-gray-400 italic text-center py-2">Aucune sous-catégorie.</p>
      ) : (
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
          {subcategories.map(sub => (
            <div key={sub.id} className="flex items-center justify-between bg-white p-2 rounded border border-gray-100 hover:border-blue-100 transition-colors">
              {editingId === sub.id ? (
                <div className="flex-1 flex flex-col gap-2">
                   <input 
                      type="text" 
                      className="w-full p-1 text-sm border rounded"
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                    />
                    <div className="flex gap-2">
                       <button onClick={saveEdit} className="text-green-600"><Check size={16} /></button>
                       <button onClick={() => setEditingId(null)} className="text-red-500"><X size={16} /></button>
                    </div>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{sub.name}</p>
                    {sub.description && <p className="text-xs text-gray-400">{sub.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(sub)} className="text-gray-400 hover:text-[#003D7A]"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(sub.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSubcategoriesManager;