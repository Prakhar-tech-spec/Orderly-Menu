import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './UserContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  selectedOptions?: {
    name: string;
    price: number;
  }[];
  notes?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { deviceId, userIP } = useUser();

  // Load cart from localStorage on mount
  useEffect(() => {
    const cartKey = `cart_${deviceId}_${userIP}`;
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, [deviceId, userIP]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const cartKey = `cart_${deviceId}_${userIP}`;
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, deviceId, userIP]);

  const addItem = (item: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);
      if (existingItem) {
        return currentItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...currentItems, { ...item }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalAmount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;