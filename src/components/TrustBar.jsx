import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, RefreshCw, MessageCircle, Award } from 'lucide-react';

const benefits = [
  { icon: Truck, title: "Expédition rapide", subtitle: "Rapide et sécurisée" },
  { icon: Clock, title: "Livraison le lendemain", subtitle: "Gagner du temps" },
  { icon: RefreshCw, title: "Retours faciles", subtitle: "Un retour simple" },
  { icon: MessageCircle, title: "Service client expert", subtitle: "Chat ou par téléphone" },
  { icon: Award, title: "Marques exclusives", subtitle: "Soigneusement sélectionnées" },
];

function TrustBar() {
  return (
    <section className="bg-kayjoko-green py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="mb-4 p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors animate-pulse-slow">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-green-50 text-sm font-medium">{item.subtitle}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TrustBar;