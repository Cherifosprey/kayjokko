import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, Truck, User, CreditCard, Wallet, Banknote, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_WHATSAPP_NUMBER, formatOrderMessage, generateWhatsAppLink } from '@/utils/whatsappConfig';

function CheckoutForm() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { total } = getCartTotal();
  const totalAmount = total;
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Sénégal',
    paymentMethod: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSelect = (method) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        toast({ title: "Champs manquants", description: "Veuillez remplir toutes les informations personnelles.", variant: "destructive" });
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast({ title: "Email invalide", description: "Veuillez entrer une adresse email valide.", variant: "destructive" });
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.address || !formData.city) {
        toast({ title: "Adresse incomplète", description: "Veuillez indiquer votre adresse de livraison.", variant: "destructive" });
        return false;
      }
    }
    if (currentStep === 3) {
      if (!formData.paymentMethod) {
        toast({ title: "Paiement requis", description: "Veuillez choisir un mode de paiement.", variant: "destructive" });
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    if (window.confirm("Voulez-vous finaliser votre commande sur WhatsApp ?")) {
      setIsProcessing(true);

      try {
        // 1. Format the message
        const message = formatOrderMessage(formData, cartItems, totalAmount);

        // 2. Generate the link
        const whatsappLink = generateWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, message);

        // 3. Open WhatsApp
        window.open(whatsappLink, '_blank');

        // 4. Clear cart and show success
        clearCart();
        
        toast({
          title: "Commande redirigée !",
          description: "Votre commande a été transférée sur WhatsApp. Merci de valider l'envoi du message.",
          className: "bg-green-600 text-white border-none"
        });

        // 5. Redirect home
        setTimeout(() => {
          navigate('/');
        }, 2000);

      } catch (error) {
        console.error("Error processing WhatsApp order:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la redirection vers WhatsApp.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const inputClass = "w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-kayjoko-blue focus:ring-2 focus:ring-kayjoko-blue/20 outline-none transition-all bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  const paymentOptions = [
    { id: 'Wave', label: 'Wave', color: 'bg-[#1dc0f1]', hover: 'hover:bg-[#1ab3e0]', text: 'text-white', icon: Wallet },
    { id: 'Orange Money', label: 'Orange Money', color: 'bg-[#ff7900]', hover: 'hover:bg-[#e66d00]', text: 'text-white', icon: Wallet },
    { id: 'Espèces', label: 'Paiement à la livraison', color: 'bg-green-600', hover: 'hover:bg-green-700', text: 'text-white', icon: Banknote },
  ];

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative z-10 max-w-lg mx-auto">
          {[
            { id: 1, label: 'Infos', icon: User },
            { id: 2, label: 'Livraison', icon: Truck },
            { id: 3, label: 'Paiement', icon: CreditCard }
          ].map((s) => (
            <div key={s.id} className="flex flex-col items-center flex-1 relative z-10">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                step >= s.id 
                  ? 'bg-kayjoko-blue border-kayjoko-blue text-white shadow-lg scale-110' 
                  : 'bg-white border-gray-200 text-gray-400'
              }`}>
                {step > s.id ? <Check className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={`mt-2 text-xs font-medium uppercase tracking-wide ${step >= s.id ? 'text-kayjoko-blue' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
          {/* Progress Line */}
          <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-100 -z-0" />
          <div className={`absolute top-6 left-0 h-0.5 bg-kayjoko-blue -z-0 transition-all duration-500`} style={{ width: `${((step - 1) / 2) * 100}%` }} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-gray-900 border-b pb-4">Informations Personnelles</h3>
              
              <div className="grid gap-6">
                <div>
                  <label className={labelClass}>Nom complet <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="fullName" 
                      value={formData.fullName} 
                      onChange={handleChange} 
                      className={`${inputClass} ${!formData.fullName && 'border-gray-200'}`}
                      placeholder="Prénom et Nom" 
                    />
                    {formData.fullName.length > 2 && <Check className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                    <div className="relative">
                       <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className={inputClass} 
                        placeholder="exemple@email.com" 
                      />
                      {/\S+@\S+\.\S+/.test(formData.email) && <Check className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Téléphone <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        className={inputClass} 
                        placeholder="+221 77 XXX XX XX" 
                      />
                      {formData.phone.length > 8 && <Check className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-gray-900 border-b pb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-kayjoko-blue" />
                Adresse de Livraison
              </h3>
              
              <div>
                <label className={labelClass}>Adresse <span className="text-red-500">*</span></label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass} placeholder="Quartier, Rue, N° Villa..." />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Ville <span className="text-red-500">*</span></label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} placeholder="Dakar" />
                </div>
                <div>
                  <label className={labelClass}>Code Postal</label>
                  <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className={inputClass} placeholder="12500" />
                </div>
              </div>
              
              <div>
                <label className={labelClass}>Pays</label>
                <select name="country" value={formData.country} onChange={handleChange} className={inputClass}>
                  <option value="Sénégal">Sénégal</option>
                  <option value="Gambie">Gambie</option>
                  <option value="Mali">Mali</option>
                  <option value="Guinée">Guinée</option>
                </select>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-gray-900 border-b pb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-kayjoko-blue" />
                Mode de Paiement
              </h3>
              
              <p className="text-gray-600 mb-4">Choisissez comment vous souhaitez régler votre commande :</p>

              <div className="grid gap-4">
                {paymentOptions.map((option) => (
                  <div 
                    key={option.id}
                    onClick={() => handlePaymentSelect(option.id)}
                    className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      formData.paymentMethod === option.id 
                        ? 'border-kayjoko-blue bg-blue-50/50 shadow-md transform scale-[1.02]' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg ${option.color} flex items-center justify-center mr-4 shadow-sm text-white shrink-0`}>
                      <option.icon size={24} />
                    </div>
                    
                    <div className="flex-1">
                      <span className="font-bold text-gray-900 block">{option.label}</span>
                      <span className="text-xs text-gray-500">
                         {option.id === 'Espèces' ? 'Paiement à la réception du colis' : 'Paiement mobile sécurisé'}
                      </span>
                    </div>

                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      formData.paymentMethod === option.id 
                        ? 'border-kayjoko-blue bg-kayjoko-blue' 
                        : 'border-gray-300'
                    }`}>
                      {formData.paymentMethod === option.id && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep} className="border-gray-300 h-12 px-6">
              <ChevronLeft className="w-4 h-4 mr-2" /> Retour
            </Button>
          ) : <div />}
          
          {step < 3 ? (
            <Button type="button" onClick={nextStep} className="bg-kayjoko-blue hover:bg-kayjoko-light-blue text-white h-12 px-8 shadow-lg">
              Suivant <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
             <Button 
               type="submit" 
               disabled={isProcessing} 
               className="bg-[#25D366] hover:bg-[#128C7E] text-white h-12 px-8 shadow-lg flex items-center gap-2 transition-colors"
             >
              {isProcessing ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <MessageCircle size={20} />
              )}
              COMMANDER SUR WHATSAPP
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CheckoutForm;