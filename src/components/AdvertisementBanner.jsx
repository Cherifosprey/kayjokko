import React from 'react';
import { motion } from 'framer-motion';

function AdvertisementBanner() {
  const textPart1 = "BIENVENUE SUR KAYJOKKO - DÉCOUVREZ NOS MEILLEURES OFFRES - LIVRAISON GRATUITE À PARTIR DE 50 000 FCFA - CONTACTEZ-NOUS: ";
  const phoneNumber = "+221772771917";
  const whatsappUrl = "https://wa.me/221772771917";

  const bannerContent = (
    <span className="font-bold text-[12px] md:text-[14px] tracking-wide flex items-center">
      {textPart1}
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="ml-1 hover:text-green-400 transition-colors duration-200 underline decoration-dotted underline-offset-2"
      >
        {phoneNumber}
      </a>
    </span>
  );

  return (
    <div className="sticky top-0 z-40 w-full h-[70px] bg-gradient-to-r from-[#003D7A] to-[#001a33] text-white flex items-center justify-center overflow-hidden shadow-md transition-all duration-300 hover:brightness-110">
      
      {/* Desktop & Tablet View (Centered Text) */}
      <div className="hidden md:flex items-center justify-center w-full px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {bannerContent}
        </motion.div>
      </div>

      {/* Mobile View (Marquee) */}
      <div className="md:hidden w-full flex items-center overflow-hidden whitespace-nowrap">
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{ 
            repeat: Infinity, 
            duration: 20, 
            ease: "linear" 
          }}
          className="flex items-center"
        >
          <div className="px-4">
            {bannerContent}
          </div>
          {/* Duplicate for seamless loop if needed, but for simple marquee one is usually fine with 100% to -100% */}
          <div className="px-4">
            {bannerContent}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdvertisementBanner;