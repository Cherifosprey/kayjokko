import React, { useState } from 'react';
import { Plus, PackageX, Loader2 } from 'lucide-react';
import AdminHeader from '@/components/AdminHeader';
import ProductTable from '@/components/ProductTable';
import KayjokoProductForm from '@/components/KayjokoProductForm';
import { useKayjokoProducts } from '@/hooks/useKayjokoProducts';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient.js';

const AdminProductsPage = () => {
  // Pass false to fetch even inactive products for admin
  const { products, loading, refetch } = useKayjokoProducts(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { toast } = useToast();

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      const { error } = await supabase.from('kayjoko_products').delete().eq('id', productId);
      
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Succès", description: "Produit supprimé", className: "bg-green-600 text-white" });
        refetch();
      }
    }
  };

  const handleSaveSuccess = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdminHeader />
      
      <main className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestion des Produits</h2>
            <p className="text-gray-500">Ajoutez, modifiez ou supprimez vos produits</p>
          </div>
          <button 
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-[#4CAF50] hover:bg-[#43a047] text-white px-6 py-3 rounded-lg font-bold shadow-md transition-all active:scale-95"
          >
            <Plus size={20} />
            AJOUTER UN PRODUIT
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <PackageX className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-500 max-w-sm mb-6">
              Votre catalogue est actuellement vide. Utilisez le bouton ci-dessus pour ajouter votre premier produit.
            </p>
            <button 
              onClick={handleAddProduct}
              className="text-[#003D7A] font-semibold hover:underline"
            >
              Créer un nouveau produit
            </button>
          </div>
        ) : (
          <ProductTable 
            products={products} 
            onEdit={handleEditProduct} 
            onDelete={handleDeleteProduct} 
          />
        )}
      </main>

      <KayjokoProductForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={editingProduct}
        onSave={handleSaveSuccess}
      />
    </div>
  );
};

export default AdminProductsPage;