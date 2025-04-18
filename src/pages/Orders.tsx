import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, where, or } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
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
  userIP: string;
  deviceId?: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { userIP, deviceId, isLoading } = useUser();

  // Set up real-time listener for orders
  useEffect(() => {
    // Wait for user context to load
    if (isLoading) {
      console.log('Waiting for user context to load...');
      return;
    }

    console.log('Setting up real-time listener for orders with IP:', userIP, 'and Device ID:', deviceId);
    
    if (!userIP && !deviceId) {
      console.error('No user identification available');
      setError('Unable to identify your device. Please try again later.');
      setLoading(false);
      return;
    }
    
    const ordersRef = collection(firestore, 'orders');
    
    // Create a query to find orders matching either userIP or deviceId
    let q;
    
    try {
      if (userIP && deviceId) {
        q = query(
          ordersRef,
          or(
            where('userIP', '==', userIP),
            where('deviceId', '==', deviceId)
          ),
          orderBy('timestamp', 'desc')
        );
      } else if (userIP) {
        q = query(
          ordersRef,
          where('userIP', '==', userIP),
          orderBy('timestamp', 'desc')
        );
      } else {
        q = query(
          ordersRef,
          where('deviceId', '==', deviceId),
          orderBy('timestamp', 'desc')
        );
      }
      
      console.log('Query created successfully');
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          console.log('Received snapshot with', snapshot.size, 'orders');
          const ordersData: Order[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Processing order:', doc.id, data);
            
            ordersData.push({
              id: doc.id,
              items: data.items || [],
              tableNumber: data.tableNumber || 'Unknown',
              totalAmount: data.totalAmount || 0,
              status: data.status || 'pending',
              paymentStatus: data.paymentStatus || 'unpaid',
              timestamp: data.timestamp,
              paymentMethod: data.paymentMethod || 'Cash',
              userIP: data.userIP || '',
              deviceId: data.deviceId || ''
            });
          });
          console.log('Setting orders state with', ordersData.length, 'orders');
          setOrders(ordersData);
          setLoading(false);
          setError('');
        },
        (error) => {
          console.error('Error in real-time listener:', error);
          setError('Failed to load orders. Please try refreshing the page.');
          setLoading(false);
        }
      );

      return () => {
        console.log('Cleaning up orders subscription...');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up query:', error);
      setError('Failed to load orders. Please try refreshing the page.');
      setLoading(false);
    }
  }, [userIP, deviceId, isLoading]);

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

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    return status === 'paid' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
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

  const getPaymentStatusIcon = (status: Order['paymentStatus']) => {
    return status === 'paid' 
      ? <FiDollarSign className="w-5 h-5" /> 
      : <FiAlertCircle className="w-5 h-5" />;
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-gray-600">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Your Orders</h1>
      </div>

      <div className="p-4 max-w-[480px] mx-auto">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">No orders found</div>
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
                      {order.timestamp?.toDate?.() 
                        ? order.timestamp.toDate().toLocaleString()
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
                      {getPaymentStatusIcon(order.paymentStatus)}
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