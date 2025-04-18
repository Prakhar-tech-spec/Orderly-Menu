import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle } from 'react-icons/fi';
import { useUser } from '../context/UserContext';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: {
    name: string;
    price: number;
  }[];
}

interface Order {
  id: string;
  items: OrderItem[];
  tableNumber: string;
  totalAmount: number;
  status: 'pending' | 'preparing' | 'completed';
  paymentStatus: 'paid' | 'unpaid';
  timestamp: any;
  paymentMethod: string;
  userIP?: string;
  deviceId?: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { userIP, deviceId } = useUser();

  useEffect(() => {
    if (!userIP && !deviceId) {
      // Still loading user info
      return;
    }

    console.log('Fetching orders for user IP:', userIP, 'and device ID:', deviceId);
    
    // Create a query to filter orders by this user's identifiers
    const ordersRef = collection(firestore, 'orders');
    const q = query(
      ordersRef,
      // Use OR condition to match either userIP or deviceId
      where('userIP', '==', userIP || 'unknown'), 
      orderBy('timestamp', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Optional: second check to ensure we only include this user's orders
        // (only necessary if query can't do OR condition between userIP and deviceId)
        if (
          (data.userIP === userIP || data.deviceId === deviceId) ||
          (data.tableNumber === localStorage.getItem('tableNumber'))
        ) {
          ordersData.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp instanceof Timestamp ? 
              data.timestamp.toDate() : 
              new Date(data.createdAt || Date.now())
          } as Order);
        }
      });
      
      console.log('Found orders for current user:', ordersData.length);
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userIP, deviceId]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-5 h-5" />;
      case 'preparing':
        return <FiClock className="w-5 h-5" />;
      case 'completed':
        return <FiCheckCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    return status === 'paid' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-gray-600">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-[480px] mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p className="text-gray-600">You haven't placed any orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm text-gray-500">
                      {order.timestamp instanceof Date 
                        ? order.timestamp.toLocaleString()
                        : new Date().toLocaleString()}
                    </span>
                    <h3 className="font-semibold text-gray-800">
                      Table {order.tableNumber}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getPaymentStatusColor(order.paymentStatus)}`}>
                      <span>{order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-gray-600">
                      <div>
                        {item.quantity}x {item.name}
                        {item.selectedOptions?.map((option, i) => (
                          <span key={i} className="text-sm text-gray-500">
                            {' '}
                            (+{option.name})
                          </span>
                        ))}
                      </div>
                      <div>₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Payment: {order.paymentMethod}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 