import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '../config/firebase';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: {
    name: string;
    price: number;
  }[];
}

export interface Order {
  id: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'completed';
  timestamp: any;
  totalAmount: number;
  tableNumber: string;
  paymentMethod: string;
}

interface OrderContextType {
  orders: Order[];
  getUserOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Subscribe to orders collection in real-time
    const q = query(collection(firestore, 'orders'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        ordersData.push({
          id: doc.id,
          ...data
        } as Order);
      });
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  const getUserOrders = () => {
    return orders;
  };

  return (
    <OrderContext.Provider value={{ orders, getUserOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}; 