import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Tag, TrendingUp, Laptop, Monitor, Smartphone, Speaker, Zap, 
  Refrigerator, Snowflake, UtensilsCrossed, Armchair, Bike, 
  Palette, Scissors, Plug, Package, Watch, Rocket, Briefcase, 
  Wrench, Gamepad2
} from 'lucide-react';

const categories = [
  { id: 'promo', name: 'PROMO', icon: Tag, color: '#EF4444' },
  { id: 'tendances', name: 'TENDANCES', icon: TrendingUp, color: '#F97316' },
  { id: 'informatique', name: 'INFORMATIQUE', icon: Laptop, color: '#0066CC' },
  { id: 'ordinateurs', name: 'ORDINATEURS', icon: Monitor, color: '#003D7A' },
  { id: 'telephonie', name: 'TÉLÉPHONE & TABLETTE', icon: Smartphone, color: '#0099FF' },
  { id: 'image-son', name: 'IMAGE & SON', icon: Speaker, color: '#8B5CF6' },
  { id: 'electronique', name: 'ÉLECTRONIQUE', icon: Zap, color: '#6B7280' },
  { id: 'electromenager', name: 'ÉLECTROMÉNAGER', icon: Refrigerator, color: '#0066CC' },
  { id: 'climatiseurs', name: 'CLIMATISEURS', icon: Snowflake, color: '#06B6D4' },
  { id: 'cuisine', name: 'CUISINE', icon: UtensilsCrossed, color: '#F97316' },
  { id: 'mobiliers', name: 'MOBILIERS', icon: Armchair, color: '#92400E' },
  { id: 'motos', name: 'MOTOS & PIÈCES', icon: Bike, color: '#000000' },
  { id: 'cosmetiques', name: 'COSMÉTIQUES', icon: Palette, color: '#EC4899' },
  { id: 'coiffure', name: 'SALON DE COIFFURE', icon: Scissors, color: '#8B5CF6' },
  { id: 'connectique', name: 'CONNECTIQUE', icon: Plug, color: '#FBBF24' },
  { id: 'consommables', name: 'CONSOMMABLES', icon: Package, color: '#9CA3AF' },
  { id: 'objets-connectes', name: 'OBJETS CONNECTÉS', icon: Watch, color: '#0066CC' },
  { id: 'high-tech', name: 'HIGH TECH', icon: Rocket, color: '#22C55E' },
  { id: 'accessoires', name: 'ACCESSOIRES', icon: Briefcase, color: '#92400E' },
  { id: 'outils', name: 'OUTILS MAISON', icon: Wrench, color: '#F97316' },
  { id: 'jeux', name: 'JEUX & LOISIRS', icon: Gamepad2, color: '#8B5CF6' },
  { id: 'divers', name: 'DIVERS', icon: Package, color: '#6B7280' },
];

function CategoriesSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="text-[18px] md:text-2xl font-bold text-[#003D7A] mb-10 text-center uppercase tracking-wide">
          NOS CATÉGORIES
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" // shadow-2xl
                }}
                onClick={() => navigate(`/category/${cat.id}`)}
                className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col items-center justify-center cursor-pointer shadow-lg transition-all duration-300 h-[160px] group"
              >
                <motion.div 
                  className="mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon 
                    size={48} 
                    color={cat.color} 
                    strokeWidth={1.5}
                    className="transition-transform duration-300"
                  />
                </motion.div>
                <h3 className="text-[12px] font-semibold text-black text-center uppercase tracking-tight group-hover:text-[#003D7A] transition-colors duration-300">
                  {cat.name}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;