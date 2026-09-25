import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cafe_aroma_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('cafe_aroma_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addItem = (item, qty = 1) => {
    setItems((prevItems) => {
      const existing = prevItems.find((i) => i._id === item._id || i.name === item.name);
      if (existing) {
        return prevItems.map((i) =>
          i._id === item._id || i.name === item.name
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [
        ...prevItems,
        {
          _id: item._id || Date.now().toString(),
          name: item.name,
          price: Number(item.price),
          image: item.image,
          category: item.category,
          quantity: qty,
        },
      ];
    });

    showToast(`${item.name} added to your order ☕`);
  };

  const updateQuantity = (itemId, qty) => {
    if (qty <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item._id !== itemId));
    showToast('Item removed from order');
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    items,
    totalItems,
    subtotal,
    isCartOpen,
    setIsCartOpen,
    toastMessage,
    showToast,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
