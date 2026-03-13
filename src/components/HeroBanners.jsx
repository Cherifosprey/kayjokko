import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function HeroBanners() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/#products');
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[500px]">
          {/* Banner 1: Appliances */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="group relative h-[300px] md:h-full rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
            onClick={handleNavigate}
          >
            {/* Background Image with Parallax-like Zoom */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1699631559121-d8fc97c1128b"
                alt="Appareils électroménagers"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-kayjoko-blue/90 to-transparent/30" />
            
            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-center items-start z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-md leading-tight"
              >
                Économisez sur vos électroménagers
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button className="bg-kayjoko-yellow text-kayjoko-dark hover:bg-white hover:text-kayjoko-blue font-bold px-8 py-6 text-lg rounded-xl transition-all duration-300">
                  ACHETER
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Banner 2: Gaming */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="group relative h-[300px] md:h-full rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
            onClick={handleNavigate}
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src="https://images.unsplash.com/flagged/photo-1556536951-ab795e6e50f8"
                alt="Gaming Gear"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-l from-kayjoko-dark/90 to-transparent/30" />
            
            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-center items-end text-right z-10">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-kayjoko-yellow text-xl font-bold mb-2 uppercase tracking-wider"
              >
                Offre spéciale
              </motion.h3>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
              >
                Gaming Zone
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-kayjoko-dark font-bold px-8 py-6 text-lg rounded-xl transition-all duration-300 bg-transparent">
                  DÉCOUVRIR
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroBanners;