import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Inscription réussie ! 🎉",
        description: "Merci de vous être abonné à notre newsletter.",
      });
      setEmail('');
    }
  };

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
       {/* Background decoration */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-kayjoko-yellow/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
       <div className="absolute bottom-0 left-0 w-64 h-64 bg-kayjoko-blue/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-center"
        >
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-orange-500" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            S'abonner à la <span className="text-orange-500">newsletter</span>
          </h2>
          
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Restez informé de nos dernières offres, promotions exclusives et nouveautés directement dans votre boîte de réception.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 pl-6 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-kayjoko-blue focus:ring-4 focus:ring-kayjoko-blue/10 outline-none transition-all duration-300"
              />
            </div>
            <Button 
              type="submit" 
              className="h-14 px-8 bg-kayjoko-blue hover:bg-kayjoko-light-blue text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              S'INSCRIRE
              <Send className="ml-2 w-5 h-5" />
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

export default NewsletterSection;