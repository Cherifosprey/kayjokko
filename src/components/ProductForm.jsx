import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Loader2, Upload, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '@/hooks/useCategories';

const ProductForm = ({ isOpen, onClose, productToEdit, onSave }) => {
  const { categories, getSubcategoriesByCategory, loading: categoriesLoading } = useCategories();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '', // This will now store category_id (UUID)
    subcategory: '', // This will now store subcategory_id (UUID)
    price: '',
    stock: '',
    images: [],
    status: 'Actif',
    isPromo: false,
    originalPrice: '',
    discount: '',
    brand: ''
  });
  
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when opening
  useEffect(() => {
    if (productToEdit) {
      // Handle legacy single image or new images array
      let initialImages = [];
      if (productToEdit.images && Array.isArray(productToEdit.images)) {
        initialImages = productToEdit.images;
      } else if (productToEdit.image) {
        initialImages = [productToEdit.image];
      }

      setFormData({
        ...productToEdit,
        price: productToEdit.price || '',
        stock: productToEdit.stock || '',
        // Use category_id if available (Supabase data), else fallback to category
        category: productToEdit.category_id || productToEdit.category || '',
        subcategory: productToEdit.subcategory_id || productToEdit.subcategory || '',
        images: initialImages,
        isPromo: !!productToEdit.originalPrice,
        originalPrice: productToEdit.originalPrice || '',
        discount: productToEdit.discount || '',
        brand: productToEdit.brand || ''
      });
      
      // Load subcategories for the edited product's category
      const currentCatId = productToEdit.category_id || productToEdit.category;
      if (currentCatId) {
        setAvailableSubcategories(getSubcategoriesByCategory(currentCatId) || []);
      }
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        category: '',
        subcategory: '',
        price: '',
        stock: '',
        images: [],
        status: 'Actif',
        isPromo: false,
        originalPrice: '',
        discount: '',
        brand: ''
      });
      setAvailableSubcategories([]);
    }
    setErrors({});
  }, [productToEdit, isOpen, categories]); // Re-run if categories load later

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'category') {
      // When category changes, update available subcategories and reset selected subcategory
      setAvailableSubcategories(getSubcategoriesByCategory(value) || []);
      setFormData(prev => ({
        ...prev,
        category: value,
        subcategory: '' // Reset subcategory
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setErrors(prev => ({ ...prev, images: null }));

    if (formData.images.length + files.length > 5) {
      setErrors(prev => ({ ...prev, images: "Maximum 5 images autorisées" }));
      return;
    }

    files.forEach(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, images: "Format d'image invalide (JPG, PNG, GIF, WebP uniquement)" }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, images: "L'image doit faire moins de 5MB" }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          images: [...prev.images, reader.result] 
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.category) newErrors.category = "La catégorie est requise";
    if (!formData.subcategory) newErrors.subcategory = "La sous-catégorie est requise";
    if (!formData.price || formData.price < 0) newErrors.price = "Prix valide requis";
    if (!formData.stock || formData.stock < 0) newErrors.stock = "Stock valide requis";
    if (formData.images.length === 0) newErrors.images = "Au moins une image est requise";
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Find category/subcategory names for display/legacy purposes if needed
    const selectedCategory = categories.find(c => c.id === formData.category);
    const selectedSubcategory = availableSubcategories.find(s => s.id === formData.subcategory);

    const productData = {
      ...formData,
      id: productToEdit?.id || Date.now(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      originalPrice: formData.isPromo ? Number(formData.originalPrice) : null,
      images: formData.images,
      image: formData.images[0],
      badge: formData.isPromo ? 'PROMO' : (formData.stock > 0 ? null : 'RUPTURE'),
      
      // Store both IDs (for DB) and Names (for UI fallback)
      category_id: formData.category,
      categoryName: selectedCategory ? selectedCategory.name : 'Autre',
      
      subcategory_id: formData.subcategory,
      subcategoryName: selectedSubcategory ? selectedSubcategory.name : '',
    };

    setTimeout(() => {
      onSave(productData);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">
              {productToEdit ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-2.5 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#003D7A] outline-none`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full p-2.5 rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#003D7A] outline-none bg-white`}
                      disabled={categoriesLoading}
                    >
                      <option value="">{categoriesLoading ? 'Chargement...' : 'Sélectionner une catégorie'}</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                  </div>

                  {/* Subcategory Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sous-catégorie *</label>
                    <select 
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      disabled={!formData.category || availableSubcategories.length === 0}
                      className={`w-full p-2.5 rounded-lg border ${errors.subcategory ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#003D7A] outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400`}
                    >
                      <option value="">
                        {!formData.category ? 'Sélectionnez une catégorie' :
                         availableSubcategories.length === 0 ? "Aucune sous-catégorie" : 
                         "Sélectionner une sous-catégorie"}
                      </option>
                      {availableSubcategories.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                    {errors.subcategory && <p className="text-red-500 text-xs mt-1">{errors.subcategory}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                    <input 
                      type="text" 
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003D7A] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
                      <input 
                        type="number" 
                        name="price"
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        className={`w-full p-2.5 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#003D7A] outline-none`}
                      />
                      {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                      <input 
                        type="number" 
                        name="stock"
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                        className={`w-full p-2.5 rounded-lg border ${errors.stock ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-[#003D7A] outline-none`}
                      />
                      {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images du produit * ({formData.images.length}/5)</label>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group">
                          <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {formData.images.length < 5 && (
                        <label 
                          className={`flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${errors.images ? 'border-red-500' : 'border-gray-300 hover:border-[#003D7A]'}`}
                        >
                          <Plus className="w-6 h-6 text-gray-400" />
                          <span className="text-xs text-gray-500 mt-1">Ajouter</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>
                    {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      name="description"
                      rows="5"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003D7A] outline-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <input 
                    type="checkbox" 
                    id="isPromo" 
                    name="isPromo"
                    checked={formData.isPromo}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#003D7A] rounded focus:ring-[#003D7A]"
                  />
                  <label htmlFor="isPromo" className="text-sm font-medium text-gray-800 select-none">Ce produit est en promotion</label>
                </div>

                {formData.isPromo && (
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix Original</label>
                      <input 
                        type="number" 
                        name="originalPrice"
                        min="0"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003D7A] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Badge Promo (ex: -20%)</label>
                      <input 
                        type="text" 
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        placeholder="-20%"
                        className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003D7A] outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

            </form>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              ANNULER
            </button>
            <button 
              type="submit" 
              form="productForm"
              disabled={isSubmitting}
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

export default ProductForm;