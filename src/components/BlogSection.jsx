import React from 'react';
import { motion } from 'framer-motion';

const articles = [
  {
    id: 1,
    title: 'Les Tendances Électroménager 2026',
    date: '05 Fév 2026',
    category: 'Maison',
    excerpt: 'Découvrez les dernières innovations en matière d\'électroménager disponibles chez Kayjoko. De la haute technologie aux designs modernes.',
    image: 'https://images.unsplash.com/photo-1504983875-d3b163aba9e6'
  },
  {
    id: 2,
    title: 'Choisir son Smartphone',
    date: '01 Fév 2026',
    category: 'Tech',
    excerpt: 'Notre guide complet pour choisir le smartphone qui correspond le mieux à vos besoins et à votre budget en 2026.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'
  },
  {
    id: 3,
    title: 'Kayjoko : Histoire de Confiance',
    date: '28 Jan 2026',
    category: 'Entreprise',
    excerpt: 'Retour sur le parcours de Kayjoko et notre engagement envers la communauté de Dakar depuis notre création.',
    image: 'https://images.unsplash.com/photo-1516180500701-0685eb8301a2'
  }
];

function BlogSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-[#003D7A] mb-10 text-center uppercase tracking-wide">
          ACTUALITÉS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="h-[200px] overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-[11px] text-gray-500 uppercase tracking-wider">{article.category}</span>
                   <span className="text-[10px] text-gray-400">{article.date}</span>
                </div>
                <h3 className="text-base font-bold text-black mb-2 leading-tight">{article.title}</h3>
                <p className="text-xs text-gray-500 mb-4 line-clamp-3 leading-relaxed flex-grow">
                  {article.excerpt}
                </p>
                <button className="text-[#003D7A] text-xs font-bold uppercase hover:underline text-left">
                  LIRE PLUS
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BlogSection;