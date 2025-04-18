import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle } from 'react-icons/fi';

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
  timestamp: any;
  paymentMethod: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Function to fetch orders from Firestore
  const fetchOrders = async () => {
    try {
      console.log('Fetching orders from Firestore...');
      const ordersRef = collection(firestore, 'orders');
      const q = query(ordersRef, orderBy('timestamp', 'desc'));
      
      // First try with getDocs to see if we can get any orders
      const querySnapshot = await getDocs(q);
      console.log('Fetched orders count:', querySnapshot.size);
      
      if (querySnapshot.empty) {
        console.log('No orders found in Firestore');
        setOrders([]);
        setLoading(false);
        return;
      }
      
      const ordersData: Order[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Order data:', doc.id, data);
        
        ordersData.push({
          id: doc.id,
          items: data.items || [],
          tableNumber: data.tableNumber || 'Unknown',
          totalAmount: data.totalAmount || 0,
          status: data.status || 'pending',
          timestamp: data.timestamp,
          paymentMethod: data.paymentMethod || 'Cash'
        });
      });
      
      console.log('Setting orders state with', ordersData.length, 'orders');
      setOrders(ordersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try refreshing the page.');
      setLoading(false);
    }
  };

  // Set up real-time listener for orders
  useEffect(() => {
    console.log('Setting up real-time listener for orders...');
    
    const ordersRef = collection(firestore, 'orders');
    const q = query(ordersRef, orderBy('timestamp', 'desc'));
    
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
            timestamp: data.timestamp,
            paymentMethod: data.paymentMethod || 'Cash'
          });
        });
        console.log('Setting orders state with', ordersData.length, 'orders');
        setOrders(ordersData);
        setLoading(false);
        setError('');
      },
      (error) => {
        console.error('Error in real-time listener:', error);
        // If real-time listener fails, try one-time fetch
        fetchOrders();
      }
    );

    // Also do an initial fetch
    fetchOrders();

    return () => {
      console.log('Cleaning up orders subscription...');
      unsubscribe();
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      console.log('Updating order status:', orderId, 'to', newStatus);
      const orderRef = doc(firestore, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        lastUpdated: serverTimestamp()
      });
      console.log('Successfully updated order status');
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status. Please try again.');
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-gray-600">Loading orders...</div>
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
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="p-4 max-w-[480px] mx-auto">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">No orders yet</div>
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
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
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

                  {/* Admin Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors ${
                        order.status === 'preparing'
                          ? 'bg-[#FE4A12] text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      disabled={order.status === 'completed'}
                    >
                      Preparing
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors ${
                        order.status === 'completed'
                          ? 'bg-[#FE4A12] text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      Completed
                    </button>
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

export default AdminOrders; 