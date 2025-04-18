import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiDollarSign, FiAlertCircle, FiCreditCard } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
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
  status: 'pending' | 'preparing' | 'completed' | string;
  paymentStatus: 'paid' | 'unpaid';
  timestamp: any;
  paymentMethod: string;
  userId: string;
}

type TabType = 'active' | 'completed' | 'unpaidCompleted';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { userIP } = useUser();  // Use UserContext instead of AuthContext for now

  // Payment summary stats
  const [paymentStats, setPaymentStats] = useState({
    paidCount: 0,
    paidTotal: 0,
    unpaidCount: 0,
    unpaidTotal: 0,
    paymentMethods: {} as Record<string, { count: number; total: number }>
  });

  // Set up real-time listener for orders
  useEffect(() => {
    console.log('Setting up real-time listener for orders...');
    
    const ordersRef = collection(firestore, 'orders');
    const q = query(ordersRef, orderBy('timestamp', 'desc'));
    
    try {
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          console.log('Received snapshot with', snapshot.size, 'orders');
          const ordersData: Order[] = [];
          
          if (snapshot.empty) {
            console.log('No orders found in the database');
            setOrders([]);
            setLoading(false);
            return;
          }
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Processing order:', doc.id, data);
            
            // Ensure items array is not undefined and properly formatted
            const items = Array.isArray(data.items) ? data.items : [];
            console.log('Order items:', items.length);
            
            try {
              ordersData.push({
                id: doc.id,
                items: items,
                tableNumber: data.tableNumber || 'Unknown',
                totalAmount: data.totalAmount || 0,
                status: data.status || 'pending',
                paymentStatus: data.paymentStatus || 'unpaid',
                timestamp: data.timestamp || Timestamp.now(),
                paymentMethod: data.paymentMethod || 'Cash',
                userId: data.userId || ''
              });
            } catch (err) {
              console.error('Error processing order:', doc.id, err);
            }
          });
          
          console.log('Setting orders state with', ordersData.length, 'orders');
          setOrders(ordersData);
          updatePaymentStats(ordersData);
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
    } catch (err) {
      console.error('Failed to set up subscription:', err);
      setError('Failed to connect to the database. Please try refreshing the page.');
      setLoading(false);
    }
  }, []);

  // Update payment statistics
  const updatePaymentStats = (orders: Order[]) => {
    const stats = {
      paidCount: 0,
      paidTotal: 0,
      unpaidCount: 0,
      unpaidTotal: 0,
      paymentMethods: {} as Record<string, { count: number; total: number }>
    };

    orders.forEach(order => {
      // Count by payment status
      if (order.paymentStatus === 'paid') {
        stats.paidCount++;
        stats.paidTotal += order.totalAmount;
      } else {
        stats.unpaidCount++;
        stats.unpaidTotal += order.totalAmount;
      }

      // Count by payment method
      if (order.paymentStatus === 'paid') {
        const method = order.paymentMethod || 'Unknown';
        if (!stats.paymentMethods[method]) {
          stats.paymentMethods[method] = { count: 0, total: 0 };
        }
        stats.paymentMethods[method].count++;
        stats.paymentMethods[method].total += order.totalAmount;
      }
    });

    setPaymentStats(stats);
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    if (!userIP) return;

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

  const updatePaymentStatus = async (orderId: string, newStatus: Order['paymentStatus']) => {
    if (!userIP) return;

    try {
      console.log('Updating payment status:', orderId, 'to', newStatus);
      const orderRef = doc(firestore, 'orders', orderId);
      
      // Find the order in the current state
      const orderToUpdate = orders.find(o => o.id === orderId);
      
      // If the order is being marked as paid, also ensure it's marked as completed
      if (newStatus === 'paid') {
        console.log('Marking order as paid and completed');
        await updateDoc(orderRef, {
          paymentStatus: newStatus,
          status: 'completed',
          lastUpdated: serverTimestamp(),
          paidAt: serverTimestamp() // Add timestamp for when payment was received
        });
        
        // Optimistically update the local state to improve UI responsiveness
        if (orderToUpdate) {
          // Clone the current orders array
          const updatedOrders = orders.map(order => {
            if (order.id === orderId) {
              return {
                ...order,
                paymentStatus: 'paid' as Order['paymentStatus'],
                status: 'completed' as Order['status']
              };
            }
            return order;
          });
          
          // Update the orders state with the modified array
          setOrders(updatedOrders);
          
          // Update payment statistics
          updatePaymentStats(updatedOrders);
        }
      } else {
        await updateDoc(orderRef, {
          paymentStatus: newStatus,
          lastUpdated: serverTimestamp()
        });
      }
      
      console.log('Successfully updated payment status');
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError('Failed to update payment status. Please try again.');
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

  // Filter orders based on the active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'active') {
      // Show all orders that are not paid
      return order.paymentStatus !== 'paid';
    } else if (activeTab === 'completed') {
      return (order.status as string) === 'completed' && order.paymentStatus === 'paid';
    } else if (activeTab === 'unpaidCompleted') {
      return (order.status as string) === 'completed' && order.paymentStatus === 'unpaid';
    }
    return true;
  });

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

      {/* Payment Summary */}
      <div className="p-4 mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Payment Summary</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-green-800">Paid Orders</h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xl font-bold text-green-800">{paymentStats.paidCount}</span>
                <span className="text-lg font-bold text-green-800">₹{paymentStats.paidTotal}</span>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-red-800">Unpaid Orders</h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xl font-bold text-red-800">{paymentStats.unpaidCount}</span>
                <span className="text-lg font-bold text-red-800">₹{paymentStats.unpaidTotal}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Breakdown */}
          <h3 className="text-sm font-medium mb-2">Payment Method Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(paymentStats.paymentMethods).map(([method, stats]) => (
              <div key={method} className="flex justify-between items-center">
                <span className="text-gray-600">{method}</span>
                <div className="text-right">
                  <div className="font-medium">₹{stats.total}</div>
                  <div className="text-sm text-gray-500">{stats.count} orders</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 px-4 rounded-full font-medium ${
              activeTab === 'active' ? 'bg-[#FE4A12] text-white' : 'bg-gray-100'
            }`}
          >
            Active Orders
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 px-4 rounded-full font-medium ${
              activeTab === 'completed' ? 'bg-[#FE4A12] text-white' : 'bg-gray-100'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('unpaidCompleted')}
            className={`flex-1 py-2 px-4 rounded-full font-medium ${
              activeTab === 'unpaidCompleted' ? 'bg-[#FE4A12] text-white' : 'bg-gray-100'
            }`}
          >
            Unpaid
          </button>
        </div>
      </div>

      <div className="p-4 max-w-[480px] mx-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">No orders in this category</div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
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

                  {/* Notice for completed but unpaid orders */}
                  {(order.status as string) === 'completed' && order.paymentStatus === 'unpaid' && (
                    <div className="mt-2 p-2 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                      <strong>Note:</strong> This order is completed but not yet paid. Please collect payment.
                    </div>
                  )}

                  {/* Admin Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors ${
                        (order.status as string) === 'preparing'
                          ? 'bg-[#FE4A12] text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      disabled={order.paymentStatus === 'paid'}
                    >
                      Preparing
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors ${
                        (order.status as string) === 'completed'
                          ? 'bg-[#FE4A12] text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      disabled={order.paymentStatus === 'paid'}
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => updatePaymentStatus(order.id, 'paid')}
                      className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-500 text-white'
                          : (order.status as string) === 'completed'
                            ? 'bg-[#FE4A12] text-white font-bold'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      disabled={order.paymentStatus === 'paid'}
                    >
                      {(order.status as string) === 'completed' && order.paymentStatus === 'unpaid'
                        ? 'COLLECT PAYMENT'
                        : 'Paid'}
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