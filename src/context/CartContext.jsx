import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('kayjoko_cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kayjoko_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1, variants = {}) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => 
        item.id === product.id && 
        JSON.stringify(item.variants) === JSON.stringify(variants)
      );

      // Ensure we store the main image for cart display
      const cartImage = product.images && product.images.length > 0 ? product.images[0] : product.image;

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        return [...prevItems, { 
          ...product, 
          image: cartImage, // Normalize image for cart
          quantity, 
          variants 
        }];
      }
    });
  };

  const removeFromCart = (productId, variants = null) => {
    setCartItems(prevItems => 
      prevItems.filter(item => {
        if (variants) {
           return !(item.id === productId && JSON.stringify(item.variants) === JSON.stringify(variants));
        }
        return item.id !== productId;
      })
    );
  };

  const updateQuantity = (productId, quantity, variants = null) => {
    if (quantity < 1) return;
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === productId) {
           if (variants && JSON.stringify(item.variants) !== JSON.stringify(variants)) {
             return item;
           }
           return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
      subtotal: total,
      total: total
    };
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};