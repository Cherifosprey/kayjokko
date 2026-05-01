import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Loader2, Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient.js';
import { useToast } from '@/components/ui/use-toast';

const KayjokoProductForm = ({ isOpen, onClose, productToEdit, onSave }) => {
  const { toast } = useToast();
 
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    subcategory_id: '',
    price: '',
    stock: '',
    is_active: true,
    is_promo: false,
    original_price: '',
    discount_badge: ''
  });
 
  const [images, setImages] = useState([]);
  
  // États pour les catégories dynamiques Supabase
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [activeSubcategories, setActiveSubcategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // État pour la création de sous-catégorie
  const [isCreatingSubcategory, setIsCreatingSubcategory] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  // 1. Charger toutes les catégories et sous-catégories à l'ouverture
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCats(true);
      try {
        const { data: catData } = await supabase.from('kayjoko_categories').select('*').order('name');
        const { data: subData } = await supabase.from('kayjoko_subcategories').select('*').order('name');
        setCategories(catData || []);
        setSubcategories(subData || []);
      } catch (error) {
        console.error("Erreur chargement catégories:", error);
      } finally {
        setLoadingCats(false);
      }
    };
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // 2. Filtrer les sous-catégories quand la catégorie change
  useEffect(() => {
    if (formData.category_id) {
      const subs = subcategories.filter(sub => String(sub.category_id) === String(formData.category_id));
      setActiveSubcategories(subs);
    } else {
      setActiveSubcategories([]);
    }
  }, [formData.category_id, subcategories]);

  // 3. Initialiser le formulaire
  useEffect(() => {
    if (productToEdit && isOpen) {
      setFormData({
        name: productToEdit.name,
        description: productToEdit.description || '',
        category_id: productToEdit.category_id || '',
        subcategory_id: productToEdit.subcategory_id || '',
        price: productToEdit.price,
        stock: productToEdit.stock,
        is_active: productToEdit.is_active ?? true,
        is_promo: productToEdit.is_promo || false,
        original_price: productToEdit.original_price || '',
        discount_badge: productToEdit.discount_badge || ''
      });
      setIsCreatingSubcategory(false);
      setNewSubcategoryName('');
      
      const fetchImages = async () => {
        const { data } = await supabase
          .from('kayjoko_product_images')
          .select('*')
          .eq('product_id', productToEdit.id)
          .order('display_order', { ascending: true });
       
        if (data && data.length > 0) {
          setImages(data);
        } else if (productToEdit.image_url) {
          setImages([{
            id: 'legacy',
            image_url: productToEdit.image_url,
            is_primary: true,
            display_order: 0
          }]);
        }
      };
      fetchImages();
    } else if (isOpen) {
      setFormData({
        name: '',
        description: '',
        category_id: '',
        subcategory_id: '',
        price: '',
        stock: '',
        is_active: true,
        is_promo: false,
        original_price: '',
        discount_badge: ''
      });
      setImages([]);
      setIsCreatingSubcategory(false);
      setNewSubcategoryName('');
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'category_id' ? { subcategory_id: '' } : {})
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const files = Array.from(e.target.files);
      if (files.length === 0) return;
      
      const newImages = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
       
        newImages.push({
          image_url: data.publicUrl,
          is_primary: images.length === 0 && newImages.length === 0,
          display_order: images.length + newImages.length
        });
      }
      setImages(prev => [...prev, ...newImages]);
      toast({ title: "Images téléchargées avec succès" });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({ title: "Erreur lors du téléchargement", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const setPrimaryImage = (index) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      is_primary: i === index
    })));
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (prev[index].is_primary && newImages.length > 0) {
        newImages[0].is_primary = true;
      }
      return newImages;
    });
  };

  const moveImage = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const newImages = [...images];
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
      setImages(newImages);
    } else if (direction === 'down' && index < images.length - 1) {
      const newImages = [...images];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      setImages(newImages);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.category_id) newErrors.category_id = "La catégorie est requise";
    if (!isCreatingSubcategory && !formData.subcategory_id) newErrors.subcategory_id = "La sous-catégorie est requise";
    if (!formData.price || formData.price < 0) newErrors.price = "Prix valide requis";
    if (images.length === 0) newErrors.images = "Au moins une image est requise";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
   
    try {
      let finalCategoryId = formData.category_id;
      let finalSubcategoryId = formData.subcategory_id;
      
      // Gestion de la création de la sous-catégorie
      if (isCreatingSubcategory) {
        if (!newSubcategoryName.trim()) {
           toast({ title: "Erreur", description: "Le nom de la sous-catégorie est requis", variant: "destructive" });
           setIsSubmitting(false);
           return;
        }
        
        const { data: existingSub } = await supabase
          .from('kayjoko_subcategories')
          .select('*')
          .ilike('name', newSubcategoryName.trim())
          .eq('category_id', finalCategoryId);
         
        if (existingSub && existingSub.length > 0) {
           toast({ title: "Erreur", description: "Cette sous-catégorie existe déjà", variant: "destructive" });
           setIsSubmitting(false);
           return;
        }
        
        const { data: newSubData, error: subErr } = await supabase
          .from('kayjoko_subcategories')
          .insert({ category_id: finalCategoryId, name: newSubcategoryName.trim() })
          .select()
          .single();
          
        if (subErr) throw subErr;
        finalSubcategoryId = newSubData.id;
      }

      const primaryImg = images.find(img => img.is_primary) || images[0];
      
      const productPayload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category_id: finalCategoryId,
        subcategory_id: finalSubcategoryId,
        image_url: primaryImg?.image_url || '',
        is_active: formData.is_active,
        is_promo: formData.is_promo,
        original_price: formData.is_promo ? Number(formData.original_price) : null,
        discount_badge: formData.is_promo ? formData.discount_badge : null
      };

      let productId = productToEdit?.id;
      
      if (productToEdit) {
        const { error } = await supabase
          .from('kayjoko_products')
          .update({ ...productPayload, updated_at: new Date() })
          .eq('id', productToEdit.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('kayjoko_products')
          .insert(productPayload)
          .select()
          .single();
        if (error) throw error;
        productId = data.id;
      }

      if (productToEdit) {
        await supabase.from('kayjoko_product_images').delete().eq('product_id', productId);
      }
      
      const imagesPayload = images.map((img, idx) => ({
        product_id: productId,
        image_url: img.image_url,
        is_primary: img.is_primary,
        display_order: idx
      }));
      
      if (imagesPayload.length > 0) {
        const { error: imgError } = await supabase.from('kayjoko_product_images').insert(imagesPayload);
        if (imgError) throw imgError;
      }
      
      onSave();
      onClose();
      toast({ title: productToEdit ? "Produit mis à jour" : "Produit créé" });
    } catch (error) {
      console.error('Error saving product:', error);
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
       
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">
              {productToEdit ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <form id="productForm" onSubmit={handleSubmit} className="space-y-8">
             
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange}
                      className={`w-full p-2.5 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#003D7A] outline-none`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                      <select
                        name="category_id" 
                        value={formData.category_id} 
                        onChange={handleChange}
                        disabled={loadingCats}
                        className={`w-full p-2.5 rounded-lg border ${errors.category_id ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#003D7A] outline-none bg-white`}
                      >
                        <option value="">Choisir...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Sous-catégorie *</label>
                      </div>
                     
                      {!isCreatingSubcategory ? (
                        <>
                          <select
                            name="subcategory_id" 
                            value={formData.subcategory_id} 
                            onChange={handleChange}
                            className={`w-full p-2.5 rounded-lg border ${errors.subcategory_id ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#003D7A] outline-none bg-white`}
                            disabled={!formData.category_id || activeSubcategories.length === 0}
                          >
                            <option value="">
                              {!formData.category_id ? 'Sélectionnez une catégorie' :
                               activeSubcategories.length === 0 ? 'Aucune sous-catégorie' : 'Choisir...'}
                            </option>
                            {activeSubcategories.map(sub => (
                              <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                          </select>
                          {errors.subcategory_id && <p className="text-red-500 text-xs mt-1">{errors.subcategory_id}</p>}
                        </>
                      ) : (
                        <input
                          type="text"
                          placeholder="Nom de la sous-catégorie"
                          value={newSubcategoryName}
                          onChange={(e) => setNewSubcategoryName(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003D7A] outline-none"
                        />
                      )}
                     
                      <div className="mt-2 flex items-center">
                        <input
                          type="checkbox"
                          id="create_subcat"
                          checked={isCreatingSubcategory}
                          onChange={(e) => setIsCreatingSubcategory(e.target.checked)}
                          disabled={!formData.category_id}
                          className="w-3.5 h-3.5 text-[#003D7A] rounded focus:ring-[#003D7A] mr-2"
                        />
                        <label htmlFor="create_subcat" className="text-xs text-[#003D7A] cursor-pointer hover:underline">
                          Créer une nouvelle sous-catégorie
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
                      <input
                        type="number" name="price" min="0" value={formData.price} onChange={handleChange}
                        className={`w-full p-2.5 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#003D7A] outline-none`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                      <input
                        type="number" name="stock" min="0" value={formData.stock} onChange={handleChange}
                        className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003D7A] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description" rows="4" value={formData.description} onChange={handleChange}
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003D7A] outline-none"
                    ></textarea>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox" id="is_promo" name="is_promo" checked={formData.is_promo} onChange={handleChange}
                        className="w-4 h-4 text-[#003D7A] rounded focus:ring-[#003D7A]"
                      />
                      <label htmlFor="is_promo" className="text-sm font-medium text-gray-800">En Promotion</label>
                    </div>
                    {formData.is_promo && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Prix Original</label>
                          <input
                            type="number" name="original_price" value={formData.original_price} onChange={handleChange}
                            className="w-full p-2 rounded border border-gray-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Badge (ex: -20%)</label>
                          <input
                            type="text" name="discount_badge" value={formData.discount_badge} onChange={handleChange}
                            className="w-full p-2 rounded border border-gray-300 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Images du produit *</label>
                    <label className="cursor-pointer bg-blue-50 text-[#003D7A] px-3 py-1.5 rounded-md text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-2">
                      <Plus size={16} /> Ajouter
                      <input
                        type="file" multiple accept="image/*" disabled={uploading} onChange={handleImageUpload} className="hidden"
                      />
                    </label>
                  </div>
                  {uploading && <div className="text-sm text-blue-600 flex items-center gap-2"><Loader2 className="animate-spin" size={14}/> Téléchargement...</div>}
                 
                  {errors.images && <p className="text-red-500 text-xs">{errors.images}</p>}
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {images.map((img, idx) => (
                      <div key={idx} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${img.is_primary ? 'border-[#003D7A] bg-blue-50/50' : 'border-gray-200 bg-white'}`}>
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                          <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                          {img.is_primary && (
                            <div className="absolute top-0 left-0 w-full bg-[#003D7A] text-white text-[10px] font-bold text-center py-0.5">
                              Principal
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(idx)}
                              className={`text-xs px-2 py-1 rounded border ${img.is_primary ? 'bg-[#003D7A] text-white border-[#003D7A]' : 'text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                            >
                              {img.is_primary ? 'Image Principale' : 'Définir comme principale'}
                            </button>
                          </div>
                         
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => moveImage(idx, 'up')} disabled={idx === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                              <ArrowUp size={16} />
                            </button>
                            <button type="button" onClick={() => moveImage(idx, 'down')} disabled={idx === images.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                              <ArrowDown size={16} />
                            </button>
                            <div className="flex-1" />
                            <button type="button" onClick={() => removeImage(idx)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                   
                    {images.length === 0 && (
                      <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aucune image ajoutée</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition-colors">
              ANNULER
            </button>
            <button
              type="submit" form="productForm" disabled={isSubmitting || uploading}
              className="px-6 py-2.5 rounded-lg font-bold text-white bg-[#4CAF50] hover:bg-[#43a047] transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {productToEdit ? 'ENREGISTRER' : 'CRÉER LE PRODUIT'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default KayjokoProductForm;