import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const navigate = useNavigate();
  const logoUrl = "https://horizons-cdn.hostinger.com/3ce8dc60-b7b9-4247-9062-c4256906ec88/de73aded341ce49d018a1c686f5378d2.jpg";

  return (
    <section className="relative min-h-[80vh] md:h-screen bg-[#001a33] overflow-hidden flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1550009158-9ebf69173e03"
          alt="Electronics Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#003D7A] via-[#003D7A]/80 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start"
        >
          <motion.img 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            src={logoUrl} 
            alt="KAYJOKKO.com Logo" 
            className="w-[150px] md:w-[180px] lg:w-[200px] mb-4"
          />
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Une nouvelle <br/>
            <span className="text-orange-400">omni-expérience</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light max-w-lg">
            Découvrez nos produits de qualité supérieure pour améliorer votre quotidien.
          </p>
          <Button 
            onClick={() => navigate('/category/all')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            DÉCOUVRIR
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>

        {/* Floating Product Images (Parallax effect simulated with varied delays) */}
        <div className="hidden lg:grid grid-cols-2 gap-4 relative">
          <motion.img
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            src="https://images.unsplash.com/photo-1546868871-7041f2a55e12"
            alt="Smart Watch"
            className="rounded-2xl shadow-2xl w-full h-64 object-cover transform translate-y-12"
          />
           <motion.img
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6"
            alt="Laptop"
            className="rounded-2xl shadow-2xl w-full h-64 object-cover"
          />
           <motion.img
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
            alt="Headphones"
            className="rounded-2xl shadow-2xl w-full h-64 object-cover col-span-2 mt-4"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;