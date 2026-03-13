import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Aminata Diallo",
    rating: 5,
    text: "Service client exceptionnel ! J'ai reçu ma commande de climatiseur en moins de 24h. L'installation était parfaite.",
    date: "12 Fév 2026"
  },
  {
    id: 2,
    name: "Cheikh Ndiaye",
    rating: 5,
    text: "Kayjoko est devenu ma référence pour l'électronique. Produits authentiques et prix imbattables sur le marché.",
    date: "05 Fév 2026"
  },
  {
    id: 3,
    name: "Sophie Fall",
    rating: 4,
    text: "Très satisfaite de mon iPhone 15. Emballage soigné et livraison sécurisée. Je recommande vivement !",
    date: "28 Jan 2026"
  }
];

function ClientReviewsSection() {
  const handleInteraction = () => {
    // Immediate toast feedback for unimplemented carousel navigation
    const toast = document.createElement('div');
    toast.className = "fixed bottom-4 right-4 bg-[#003D7A] text-white px-6 py-3 rounded-lg shadow-2xl z-[9999] animate-bounce";
    toast.innerText = "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#003D7A] mb-4">
            CE QUE DISENT NOS CLIENTS
          </h2>
          <div className="w-24 h-1 bg-[#F97316] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col h-full relative group"
            >
              <div className="absolute top-6 right-6 text-gray-100 group-hover:text-blue-50 transition-colors">
                <Quote size={48} fill="currentColor" />
              </div>

              <div className="flex text-[#F97316] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className={`${i < review.rating ? 'fill-current' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
              
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 flex-grow relative z-10 font-medium">
                "{review.text}"
              </blockquote>
              
              <div className="border-t border-gray-100 pt-4 mt-auto">
                <h4 className="text-base font-bold text-[#003D7A]">{review.name}</h4>
                <p className="text-sm text-gray-400 mt-1">{review.date}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-12">
          <button 
            onClick={handleInteraction}
            className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#003D7A] hover:text-white hover:border-[#003D7A] transition-all shadow-sm active:scale-95"
            aria-label="Previous reviews"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={handleInteraction}
            className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#003D7A] hover:text-white hover:border-[#003D7A] transition-all shadow-sm active:scale-95"
            aria-label="Next reviews"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default ClientReviewsSection;