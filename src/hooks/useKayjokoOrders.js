import { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient.js';

export const useKayjokoOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveOrder = async (customerData, cartItems, totalAmount) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Create Order
      // We explicitly select the ID to ensure we have the UUID
      const { data: order, error: orderError } = await supabase
        .from('kayjoko_orders')
        .insert({
          customer_name: customerData.fullName,
          customer_phone: customerData.phone,
          customer_address: customerData.address,
          customer_city: customerData.city,
          payment_method: customerData.paymentMethod,
          total_amount: totalAmount,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;
      
      if (!order || !order.id) {
        throw new Error('Order creation failed: No order ID returned.');
      }

      const orderId = order.id; // Ensure we capture the UUID

      // 2. Create Order Items
      const orderItems = cartItems.map(item => ({
        order_id: orderId, // Use the captured UUID
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('kayjoko_order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Update Stock (Best effort client-side decrement)
      // We iterate through items and try to update stock
      for (const item of cartItems) {
        try {
          // Try RPC first if it exists
          const { error: rpcError } = await supabase.rpc('decrement_stock', { 
             row_id: item.id, 
             amount: item.quantity 
          });
          
          if (rpcError) throw rpcError;
        } catch (err) {
           // Fallback to direct update if RPC fails or doesn't exist
           // This handles the case where the RPC function is missing
           try {
             const { data: currentProd } = await supabase
               .from('kayjoko_products')
               .select('stock')
               .eq('id', item.id)
               .single();
               
             if (currentProd) {
               const newStock = Math.max(0, currentProd.stock - item.quantity);
               await supabase
                 .from('kayjoko_products')
                 .update({ stock: newStock })
                 .eq('id', item.id);
             }
           } catch (fallbackError) {
             console.warn('Failed to update stock for item:', item.id, fallbackError);
             // We don't block the order for stock update failures, just log it
           }
        }
      }

      return { success: true, orderId: orderId, order };

    } catch (err) {
      console.error('Error saving order:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { saveOrder, loading, error };
};