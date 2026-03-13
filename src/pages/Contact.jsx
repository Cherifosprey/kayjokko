import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Phone, Mail, Clock, Send, 
  ChevronDown, ExternalLink 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { contactDetails, socialLinks } from '@/utils/contactConfig';
import { seoPages } from '@/utils/seoConfig';

function Contact() {
  const { toast } = useToast();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Commande',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    } else if (formData.message.length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caractères";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
        duration: 5000,
        className: "bg-[#003D7A] text-white border-none"
      });
      setFormData({ name: '', email: '', phone: '', subject: 'Commande', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const faqItems = [
    { question: "Quel est le délai de livraison?", answer: "Nos délais de livraison standard sont de 24 à 48h pour Dakar et 3 à 5 jours pour les régions." },
    { question: "Comment retourner un produit?", answer: "Vous avez 7 jours pour retourner un produit intact. Contactez notre service client pour initier la procédure." },
    { question: "Acceptez-vous les paiements par virement?", answer: "Oui, nous acceptons les virements bancaires ainsi que les paiements mobiles (Orange Money, Wave)." },
    { question: "Y a-t-il des frais de livraison?", answer: "La livraison est gratuite pour toute commande supérieure à 50 000 FCFA. En dessous, des frais standards s'appliquent." },
  ];

  return (
    <>
      <Helmet>
        <title>{seoPages.contact.title}</title>
        <meta name="description" content={seoPages.contact.description} />
        <meta name="keywords" content={seoPages.contact.keywords} />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#003D7A] selection:text-white">
        
        {/* Creative Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center overflow-hidden bg-[#003D7A]">
          {/* Abstract Shapes */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-[40%] bg-white opacity-[0.03] blur-3xl"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-[45%] bg-[#F97316] opacity-[0.1] blur-3xl"
          />
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium tracking-wider mb-4">
                SUPPORT 24/7
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                Parlons de votre <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-[#FFD700]">Prochain Projet</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light">
                Une question ? Une commande ? Notre équipe est là pour vous accompagner.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-20 relative z-20 pb-20">
          
          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {/* Phones Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-[#003D7A] mb-6 group-hover:scale-110 transition-transform duration-300">
                <Phone size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Appelez-nous</h3>
              <div className="space-y-3">
                {contactDetails.phones.map((phone, idx) => (
                  <a 
                    key={idx} 
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="block text-gray-600 hover:text-[#003D7A] hover:pl-2 transition-all font-medium text-lg"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Hours Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-[#F97316] mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Horaires d'ouverture</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-2">
                  <span className="font-medium">{contactDetails.openingHours.week}</span>
                  <span className="text-[#003D7A] font-bold">{contactDetails.openingHours.time}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 pt-2">
                  <span className="font-medium">Dimanche</span>
                  <span className="font-medium">{contactDetails.openingHours.sunday}</span>
                </div>
              </div>
              <p className="mt-6 text-sm text-gray-500 italic">
                Service client disponible par WhatsApp même en dehors des heures d'ouverture.
              </p>
            </motion.div>

            {/* Location Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Visitez-nous</h3>
              <a 
                href={contactDetails.googleMapsLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 text-lg mb-4 block hover:text-[#003D7A] transition-colors"
              >
                {contactDetails.address}
              </a>
              <a 
                href={`mailto:${contactDetails.email}`}
                className="flex items-center gap-2 text-[#003D7A] font-bold hover:underline"
              >
                <Mail size={18} />
                {contactDetails.email}
              </a>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Envoyez un message</h2>
                <p className="text-gray-500">Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.</p>
              </div>

              {isSuccess ? (
                 <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 text-green-700 p-8 rounded-2xl text-center border border-green-200 flex flex-col items-center justify-center h-[400px]"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Send className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message Envoyé !</h3>
                  <p>Merci de nous avoir contactés. Nous reviendrons vers vous très vite.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Nom complet</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#003D7A]/20 focus:border-[#003D7A] transition-all outline-none ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="text-red-500 text-xs ml-1">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#003D7A]/20 focus:border-[#003D7A] transition-all outline-none ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Téléphone</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#003D7A]/20 focus:border-[#003D7A] transition-all outline-none"
                        placeholder="+221 77..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Sujet</label>
                      <div className="relative">
                        <select 
                          name="subject" 
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#003D7A]/20 focus:border-[#003D7A] transition-all outline-none appearance-none cursor-pointer"
                        >
                          <option value="Commande">Question sur une commande</option>
                          <option value="Produit">Information produit</option>
                          <option value="Partenariat">Partenariat / Business</option>
                          <option value="Autre">Autre demande</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Message</label>
                    <textarea 
                      name="message" 
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#003D7A]/20 focus:border-[#003D7A] transition-all outline-none resize-none ${errors.message ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="Comment pouvons-nous vous aider aujourd'hui ?"
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-xs ml-1">{errors.message}</p>}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#003D7A] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#002a54] hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Envoi en cours...</span>
                    ) : (
                      <>
                        ENVOYER LE MESSAGE <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Social Media & FAQ Column */}
            <div className="space-y-12">
              
              {/* Social Media Grid */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-1 h-8 bg-[#003D7A] rounded-full block"></span>
                  Rejoignez la communauté
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {socialLinks.map((social, idx) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-md border border-gray-100 bg-white group hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
                      >
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${social.color}`}></div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-inner ${social.color} ${social.textColor}`}>
                          <Icon size={24} />
                        </div>
                        <span className="font-bold text-gray-700 text-sm">{social.name}</span>
                        <ExternalLink size={12} className="text-gray-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>

              {/* FAQ Accordion */}
              <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-1 h-8 bg-[#F97316] rounded-full block"></span>
                  Questions fréquentes
                </h2>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <motion.div 
                      key={index}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      <button 
                        onClick={() => toggleFaq(index)}
                        className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50/50 transition-colors"
                      >
                        <span className="font-semibold text-gray-700">{item.question}</span>
                        <motion.div
                          animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="text-[#003D7A]" size={20} />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {openFaqIndex === index && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-5 pt-0 text-gray-500 text-sm leading-relaxed">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Contact;