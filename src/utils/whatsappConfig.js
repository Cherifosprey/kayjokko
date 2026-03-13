/**
 * WhatsApp Configuration and Utilities
 */

// Default WhatsApp business number (Format: CountryCode + Number without + or spaces)
// Example: 221772771917 for Senegal (KAYJOKKO)
export const DEFAULT_WHATSAPP_NUMBER = "221772771917"; 

/**
 * Formats the order details into a readable French message for WhatsApp
 * @param {Object} formData - Customer and delivery details
 * @param {Array} cartItems - Array of items in the cart
 * @param {Number} total - Total order amount
 * @returns {String} - Formatted message string
 */
export const formatOrderMessage = (formData, cartItems, total) => {
  const date = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let message = `🛍️ *NOUVELLE COMMANDE KAYJOKKO*\n`;
  message += `📅 Date: ${date}\n\n`;

  message += `👤 *INFORMATIONS CLIENT*\n`;
  message += `👤 Nom: ${formData.fullName}\n`;
  message += `📱 Tél: ${formData.phone}\n`;
  message += `📧 Email: ${formData.email}\n\n`;

  message += `📍 *LIVRAISON*\n`;
  message += `🏠 Adresse: ${formData.address}\n`;
  message += `🏙️ Ville: ${formData.city}\n`;
  message += `📮 CP: ${formData.postalCode || 'N/A'}\n`;
  message += `🌍 Pays: ${formData.country}\n\n`;

  message += `🛒 *PANIER*\n`;
  cartItems.forEach(item => {
    const itemTotal = item.price * item.quantity;
    message += `▪️ ${item.quantity}x ${item.name}\n`;
    message += `   PU: ${item.price.toLocaleString('fr-FR')} FCFA | Total: ${itemTotal.toLocaleString('fr-FR')} FCFA\n`;
    if (item.variants && Object.keys(item.variants).length > 0) {
      const variantStr = Object.entries(item.variants)
        .map(([key, val]) => `${key}: ${val}`)
        .join(', ');
      message += `   (Options: ${variantStr})\n`;
    }
  });

  message += `\n💰 *TOTAL À PAYER: ${total.toLocaleString('fr-FR')} FCFA*\n`;
  message += `💳 Méthode: ${formData.paymentMethod}\n`;
  message += `\nMerci de confirmer la réception de ma commande ! 🙏`;

  return message;
};

/**
 * Generates the WhatsApp URL
 * @param {String} phoneNumber - The destination phone number
 * @param {String} message - The unencoded message string
 * @returns {String} - The full WhatsApp URL
 */
export const generateWhatsAppLink = (phoneNumber, message) => {
  const encodedMessage = encodeURIComponent(message);
  // Remove any non-numeric characters from phone number just in case
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};