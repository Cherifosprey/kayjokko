import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

function OrderSummary({ cartItems, subtotal, onConfirm }) {
  // Use subtotal as the final total since taxes and shipping have been removed.
  const finalTotal = subtotal;

  return (
    <div className="bg-white p-6 rounded-2xl sticky top-24 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
        <ShoppingBag className="w-5 h-5 text-kayjoko-blue" />
        Résumé de la commande
      </h2>
      
      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {cartItems.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="flex gap-4 text-sm group">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
              <img src={item.images && item.images.length > 0 ? item.images[0] : item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-gray-500 text-xs mt-1">Qté: {item.quantity}</p>
              {item.variants && Object.entries(item.variants).map(([key, val]) => (
                <span key={key} className="text-xs text-gray-400 mr-2 capitalize inline-block bg-gray-50 px-1.5 rounded">{key}: {val}</span>
              ))}
            </div>
            <p className="font-bold text-gray-900 shrink-0">{(item.price * item.quantity).toLocaleString()} F</p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 mt-2 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-kayjoko-blue">{finalTotal.toLocaleString()} <span className="text-sm font-normal text-gray-500">FCFA</span></span>
        </div>
      </div>

      {onConfirm && (
        <Button 
          onClick={onConfirm}
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl flex items-center justify-center gap-2"
        >
          COMMANDER VIA WHATSAPP
        </Button>
      )}
    </div>
  );
}

export default OrderSummary;