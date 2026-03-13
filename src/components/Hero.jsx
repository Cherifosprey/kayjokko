import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import SearchBar from '@/components/SearchBar';

function Hero() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-kayjoko-blue to-kayjoko-light-blue">
      {/* Abstract Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-kayjoko-dark/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[1000px] h-[400px] bg-white/5 -rotate-45 blur-3xl -translate-x-1/2 -translate-y-1/2" />
        {/* Waves */}
        <svg className="absolute bottom-0 w-full text-white/5" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-6 py-20 pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">
                Kayjoko
                <span className="block mt-2 text-3xl md:text-4xl lg:text-5xl font-light text-white/90">
                  La qualité au bon prix
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-4 text-xl md:text-2xl text-kayjoko-yellow font-medium"
              >
                La confiance en plus
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-md"
            >
              <SearchBar />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button
                onClick={scrollToProducts}
                className="bg-kayjoko-yellow hover:bg-yellow-400 text-kayjoko-dark font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-yellow-400/30 transition-all duration-300 animate-pulse-slow"
              >
                Découvrir nos produits
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>

          {/* Right Content - Product Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1666627762609-a9d50d5ec707"
                alt="Magasin Kayjoko"
                className="w-full h-auto object-cover"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
                <div className="bg-green-100 p-2 rounded-full">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Service Client</p>
                  <p className="text-sm font-bold text-gray-900">Disponible 24/7</p>
                </div>
              </div>
            </div>
            {/* Background Decor */}
            <div className="absolute -inset-4 bg-kayjoko-yellow/20 rounded-2xl -z-10 blur-xl transform rotate-6" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;