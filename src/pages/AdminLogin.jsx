import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) {
      navigate(from, { replace: true });
    } else {
      setError('Mot de passe incorrect');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003D7A] to-[#001a33] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[#003D7A]">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">CONNEXION ADMIN</h1>
          <p className="text-gray-500 mt-2">Accédez au tableau de bord sécurisé</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#003D7A] focus:border-transparent outline-none transition-all"
              placeholder="Entrez le mot de passe"
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <button 
            type="submit"
            className="w-full bg-[#003D7A] text-white font-bold py-3 rounded-lg shadow-lg hover:bg-[#002a54] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            SE CONNECTER
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-400 text-sm hover:text-[#003D7A] transition-colors"
          >
            Retour au site public
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;