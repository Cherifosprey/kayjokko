import React, { useState } from 'react';
import { Edit, Trash2, ChevronLeft, ChevronRight, Search, ArrowUpDown, PackageOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductTable = ({ products, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  const itemsPerPage = 10;

  // Search & Filter
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting
  const sortedProducts = React.useMemo(() => {
    let sortableProducts = [...filteredProducts];
    if (sortConfig.key) {
      sortableProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProducts;
  }, [filteredProducts, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentItems = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteClick = (product) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
      onDelete(product.id);
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <PackageOpen className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Aucun produit trouvé</h3>
        <p className="text-gray-500 max-w-sm">
          Votre catalogue est vide. Cliquez sur "Ajouter un produit" pour commencer.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un produit..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003D7A]"
          />
        </div>
        <div className="text-sm text-gray-500">
          Total : <span className="font-bold text-gray-800">{filteredProducts.length}</span> produits
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-4 w-20">Image</th>
              <th 
                className="p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => requestSort('name')}
              >
                <div className="flex items-center gap-1">Nom <ArrowUpDown size={14} /></div>
              </th>
              <th className="p-4 hidden md:table-cell">Catégorie</th>
              <th 
                className="p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => requestSort('price')}
              >
                <div className="flex items-center gap-1">Prix <ArrowUpDown size={14} /></div>
              </th>
              <th 
                className="p-4 cursor-pointer hover:bg-gray-100 transition-colors text-center"
                onClick={() => requestSort('stock')}
              >
                <div className="flex items-center gap-1 justify-center">Stock <ArrowUpDown size={14} /></div>
              </th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.length > 0 ? (
              currentItems.map((product) => (
                <motion.tr 
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                      <img 
                        src={product.images?.[0] || product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=IMG"; }}
                      />
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-800 max-w-[200px] truncate" title={product.name}>
                    {product.name}
                  </td>
                  <td className="p-4 text-gray-500 hidden md:table-cell">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">{product.categoryName || 'N/A'}</span>
                  </td>
                  <td className="p-4 font-bold text-[#003D7A]">
                    {Number(product.price).toLocaleString()} F
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onEdit(product)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(product)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  Aucun résultat pour cette recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-gray-600">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductTable;