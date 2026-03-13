import React, { useState, useEffect } from 'react';
import { Package, Grid, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import AdminHeader from '@/components/AdminHeader';
import { useKayjokoProducts } from '@/hooks/useKayjokoProducts';

const StatCard = ({ icon: Icon, title, value, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 flex items-center gap-6"
  >
    <div className={`p-5 rounded-full ${color.bg} ${color.text}`}>
      <Icon size={40} strokeWidth={2.5} />
    </div>
    <div>
      <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-4xl font-extrabold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const { products, loading } = useKayjokoProducts(false); // Fetch all for stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    recentProducts: []
  });

  useEffect(() => {
    if (!products || products.length === 0) {
      setStats({
        totalProducts: 0,
        totalCategories: 0,
        recentProducts: []
      });
      return;
    }

    const uniqueCategories = new Set(products.map(p => p.category_id).filter(Boolean)).size;
    
    setStats({
      totalProducts: products.length,
      totalCategories: uniqueCategories, // Approximation based on products usage
      recentProducts: products.slice(0, 5)
    });
  }, [products]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdminHeader />
      
      <main className="max-w-[1400px] mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tableau de bord</h2>
          <p className="text-gray-500">Aperçu global de votre boutique Kayjoko</p>
        </motion.div>

        {/* Stats Grid - Revised Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <StatCard 
            icon={Package} 
            title="Total Produits" 
            value={stats.totalProducts} 
            color={{ bg: "bg-blue-50", text: "text-blue-600" }}
            delay={0.1}
          />
          <StatCard 
            icon={Grid} 
            title="Catégories Actives" 
            value={stats.totalCategories} 
            color={{ bg: "bg-green-50", text: "text-green-600" }}
            delay={0.2}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Recent Products Table */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp size={20} className="text-[#003D7A]" /> 
                  Produits récents
                </h3>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Derniers ajouts
                </span>
             </div>
             
             {stats.recentProducts.length > 0 ? (
               <div className="overflow-hidden">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-600 font-medium">
                     <tr>
                       <th className="py-3 px-4 rounded-tl-lg">Nom</th>
                       <th className="py-3 px-4">Prix</th>
                       <th className="py-3 px-4 text-right rounded-tr-lg">Catégorie</th>
                     </tr>
                   </thead>
                   <tbody>
                     {stats.recentProducts.map((product, index) => (
                       <tr key={product.id || index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                         <td className="py-3 px-4 font-medium text-gray-800 truncate max-w-[150px]">{product.name}</td>
                         <td className="py-3 px-4 text-gray-600 font-medium whitespace-nowrap">{Number(product.price).toLocaleString()} FCFA</td>
                         <td className="py-3 px-4 text-right text-gray-500">
                           {product.categoryName}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                 <Package size={32} className="mb-2 opacity-50" />
                 <p className="text-sm">Aucun produit disponible</p>
               </div>
             )}
           </div>

           {/* Quick Actions Panel */}
           <div className="bg-gradient-to-br from-[#003D7A] to-[#001a33] text-white p-8 rounded-xl shadow-lg flex flex-col justify-center items-center text-center relative overflow-hidden">
             {/* Decorative circles */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8 blur-lg"></div>

             <h3 className="text-2xl font-bold mb-4 relative z-10">Gestion Rapide</h3>
             <p className="text-blue-100 mb-8 max-w-sm relative z-10">
               Gérez votre catalogue, vos catégories et vos stocks en quelques clics.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 relative z-10">
               <button 
                 onClick={() => window.location.href='/admin/products'} 
                 className="bg-white text-[#003D7A] font-bold py-3 px-6 rounded-full hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center gap-2"
               >
                 <Package size={18} />
                 PRODUITS
               </button>
               <button 
                 onClick={() => window.location.href='/admin/categories'} 
                 className="bg-[#4CAF50] text-white font-bold py-3 px-6 rounded-full hover:bg-[#43a047] transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center gap-2"
               >
                 <Grid size={18} />
                 CATÉGORIES
               </button>
             </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;