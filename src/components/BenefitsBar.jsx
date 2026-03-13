import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Truck, Headphones } from 'lucide-react';

function BenefitsBar() {
  const benefits = [
    { icon: ShieldCheck, text: "Livraison rapide et sécurisée" },
    { icon: CreditCard, text: "Paiement sécurisé" },
    { icon: Truck, text: "Livraison rapide" },
    { icon: Headphones, text: "Support client 24/7" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-[#1F2937] text-white py-3"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="flex items-center gap-3 justify-center w-full md:w-auto">
                <Icon size={30} className="text-white shrink-0" strokeWidth={1.5} />
                <span className="text-[12px] font-medium text-center md:text-left">
                  {benefit.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default BenefitsBar;