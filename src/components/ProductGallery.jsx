import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';

const categories = [
  'Tous',
  'Électroménagers',
  'Vêtements',
  'Accessoires',
  'Autres'
];

const products = [
  {
    id: 1,
    name: 'Réfrigérateur Double Porte',
    category: 'Électroménagers',
    price: '450 000 FCFA',
    image: 'https://images.unsplash.com/photo-1518928793541-1c4d50a9949d',
    description: 'Réfrigérateur moderne avec grande capacité et économie d\'énergie'
  },
  {
    id: 2,
    name: 'Ensemble Vêtements Élégants',
    category: 'Vêtements',
    price: '35 000 FCFA',
    image: 'https://images.unsplash.com/photo-1632065509860-4fbcfc89ed7c',
    description: 'Collection de vêtements tendance pour toutes occasions'
  },
  {
    id: 3,
    name: 'Sac à Main de Luxe',
    category: 'Accessoires',
    price: '28 000 FCFA',
    image: 'https://images.unsplash.com/photo-1588781041673-b46d78fe4e48',
    description: 'Sac à main élégant en cuir véritable'
  },
  {
    id: 4,
    name: 'Micro-ondes Digital',
    category: 'Électroménagers',
    price: '75 000 FCFA',
    image: 'https://images.unsplash.com/photo-1656053418912-ae7b147d8168',
    description: 'Micro-ondes moderne avec fonctions programmables'
  },
  {
    id: 5,
    name: 'Machine à Laver Automatique',
    category: 'Électroménagers',
    price: '320 000 FCFA',
    image: 'https://images.unsplash.com/photo-1536584754829-12214d404f32',
    description: 'Machine à laver haute performance et économique'
  },
  {
    id: 6,
    name: 'Ensemble Décoratif Maison',
    category: 'Autres',
    price: '45 000 FCFA',
    image: 'https://images.unsplash.com/photo-1473586677407-006e472ba0f0',
    description: 'Décoration intérieure élégante et moderne'
  }
];

function ProductGallery() {
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const filteredProducts = selectedCategory === 'Tous'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <section id="products-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos <span className="text-kayjoko-blue">Produits</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de produits de qualité à prix compétitifs
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-kayjoko-blue text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">
              Aucun produit trouvé dans cette catégorie
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default ProductGallery;