import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Shield, HeartHandshake as Handshake } from 'lucide-react';

const expertiseBlocks = [
  {
    icon: Briefcase,
    title: "Notre Expertise",
    description: "Avec des années d'expérience dans le commerce général à Dakar, Kayjoko s'est imposé comme une référence en matière de qualité et de diversité. Nous sélectionnons rigoureusement nos produits pour garantir satisfaction et fiabilité à nos clients."
  },
  {
    icon: Shield,
    title: "Qualité Garantie",
    description: "Tous nos produits sont soigneusement choisis et testés. Nous nous engageons à vous offrir uniquement des articles de qualité supérieure à des prix compétitifs. Votre satisfaction est notre priorité absolue."
  },
  {
    icon: Handshake,
    title: "Confiance & Service",
    description: "Notre équipe est à votre écoute pour vous conseiller et vous accompagner. Nous offrons un service après-vente exceptionnel et une relation de confiance durable avec chacun de nos clients à Dakar et au Sénégal."
  }
];

function ExpertiseSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pourquoi choisir <span className="text-kayjoko-blue">Kayjoko</span> ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Commerce général de confiance à Dakar, offrant des produits de qualité à prix compétitifs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {expertiseBlocks.map((block, index) => {
            const IconComponent = block.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-kayjoko-blue/10 p-4 rounded-full">
                    <IconComponent className="w-10 h-10 text-kayjoko-blue" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {block.title}
                </h3>
                
                <p className="text-gray-600 text-center leading-relaxed">
                  {block.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ExpertiseSection;