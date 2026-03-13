import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Link, useLocation } from 'react-router-dom';

const AdminHeader = () => {
  const { logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-[#003D7A] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
           <h1 className="text-xl font-bold tracking-tight">KAYJOKO ADMIN</h1>
        </div>
        
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/admin/dashboard') ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <LayoutDashboard size={18} />
            Tableau de bord
          </Link>
          <Link 
            to="/admin/products" 
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/admin/products') ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <Package size={18} />
            Produits
          </Link>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors text-sm font-bold shadow-sm"
        >
          <LogOut size={16} />
          DÉCONNEXION
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;