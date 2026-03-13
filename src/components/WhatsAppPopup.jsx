import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DEFAULT_WHATSAPP_NUMBER, generateWhatsAppLink } from '@/utils/whatsappConfig';

const WhatsAppPopup = () => {
  const [isVisible, setIsVisible] = useState(false); // Controls the main button visibility (delay)
  const [isOpen, setIsOpen] = useState(false); // Controls the popup card visibility

  // Initial delay and auto-open logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Check if user has previously closed the popup
      const hasClosedPopup = localStorage.getItem('whatsappPopupClosed');
      
      // Auto-open only if not closed previously
      if (!hasClosedPopup) {
        setIsOpen(true);
      }
    }, 3500); // 3.5 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('whatsappPopupClosed', Date.now().toString());
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  };

  const handleSendMessage = () => {
    const message = "Bonjour, j'aimerais avoir plus d'informations sur vos produits KAYJOKKO.";
    const link = generateWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, message);
    window.open(link, '_blank');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-4 pointer-events-none font-sans">
      <AnimatePresence>
        {isVisible && isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-xl border border-[#E5E5E5] overflow-hidden pointer-events-auto w-[280px] md:w-[300px] lg:w-[320px] relative"
          >
            {/* Close Button Top-Right */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>

            {/* Content Container */}
            <div className="p-6 flex flex-col items-center text-center">
              {/* WhatsApp Icon */}
              <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-4 text-[#25D366]">
                <MessageCircle size={28} fill="currentColor" />
              </div>

              {/* Title */}
              <h3 className="text-[18px] font-bold text-[#003D7A] mb-2 font-['Poppins'] leading-tight">
                Besoin d'aide ?
              </h3>

              {/* Message */}
              <p className="text-[14px] text-[#666666] mb-6 leading-relaxed font-normal">
                Nos équipes sont disponibles pour répondre à vos questions.
              </p>

              {/* Primary Button */}
              <Button 
                onClick={handleSendMessage}
                className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold text-[14px] h-10 rounded-lg shadow-sm mb-3 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Send size={16} className="mr-2" />
                Envoyer un message
              </Button>

              {/* Secondary Button */}
              <button
                onClick={handleClose}
                className="text-[#999999] hover:text-[#666666] text-[14px] font-bold transition-colors py-1"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggle}
            className={`
              bg-[#25D366] 
              flex items-center justify-center 
              rounded-full shadow-lg hover:shadow-xl 
              transition-all duration-300
              pointer-events-auto relative z-50
              w-[50px] h-[50px]
              md:w-[55px] md:h-[55px]
              lg:w-[60px] lg:h-[60px]
            `}
            aria-label="Ouvrir WhatsApp"
          >
            {/* Continuous Pulse Animation */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 animate-ping duration-[2000ms]"></span>
            
            {/* Icon */}
            {isOpen ? (
               <X size={28} className="text-white relative z-10" strokeWidth={2.5} />
            ) : (
               <MessageCircle size={30} className="text-white relative z-10" fill="white" />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WhatsAppPopup;