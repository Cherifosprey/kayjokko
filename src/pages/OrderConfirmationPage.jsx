import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function OrderConfirmationPage() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrder = localStorage.getItem('last_order_details');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      // Redirect if no order found (e.g. direct access)
      navigate('/');
    }
  }, [navigate]);

  if (!order) return null;

  const handleSendWhatsApp = () => {
    const itemsList = order.items.map(item => 
      `- ${item.name} (x${item.quantity})`
    ).join('\n');

    const message = `Bonjour, voici le récapitulatif de ma commande *${order.id.slice(0, 8).toUpperCase()}* :

${itemsList}

*Total : ${Number(order.total_amount).toLocaleString()} FCFA*

Nom : ${order.customer_name}
Adresse : ${order.customer_address}, ${order.customer_city}
Paiement : ${order.payment_method}

Merci de confirmer la livraison.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/221772771917?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center relative overflow-hidden"
        >
          {/* Success Icon Animation */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Commande Confirmée !
          </h1>
          <p className="text-gray-600 mb-8">
            Merci {order.customer_name}. Votre commande a été enregistrée avec succès.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200 text-left space-y-3">
             <div className="flex justify-between items-center border-b pb-2 border-gray-200">
               <span className="text-sm text-gray-500">N° de commande</span>
               <span className="font-mono font-bold text-kayjoko-blue">{order.id.slice(0, 8).toUpperCase()}</span>
             </div>
             <div className="flex justify-between items-center border-b pb-2 border-gray-200">
               <span className="text-sm text-gray-500">Montant Total</span>
               <span className="font-bold">{Number(order.total_amount).toLocaleString()} FCFA</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm text-gray-500">Paiement</span>
               <span className="font-medium">{order.payment_method}</span>
             </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
            <h3 className="font-bold text-green-800 mb-2 flex items-center justify-center gap-2">
              <MessageCircle size={18} />
              Finaliser sur WhatsApp
            </h3>
            <p className="text-sm text-green-700 mb-4">
              Envoyez le récapitulatif de votre commande sur WhatsApp pour accélérer le traitement et la livraison.
            </p>
            <Button 
              onClick={handleSendWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-12 shadow-sm"
            >
              ENVOYER SUR WHATSAPP
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button asChild variant="outline" className="border-gray-200">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default OrderConfirmationPage;