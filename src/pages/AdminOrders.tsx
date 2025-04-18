import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp, where } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiDollarSign, FiAlertCircle, FiCreditCard } from 'react-icons/fi';

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
}

type TabType = 'active' | 'completed' | 'unpaidCompleted';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Payment summary stats
  const [paymentStats, setPaymentStats] = useState({
    paidCount: 0,
    paidTotal: 0,
    unpaidCount: 0,
    unpaidTotal: 0,
    paymentMethods: {} as Record<string, { count: number; total: number }>
  });

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
          paymentStatus: data.paymentStatus || 'unpaid',
          timestamp: data.timestamp,
          paymentMethod: data.paymentMethod || 'Cash'
        });
      });
      
      console.log('Setting orders state with', ordersData.length, 'orders');
      setOrders(ordersData);
      updatePaymentStats(ordersData);
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
            paymentStatus: data.paymentStatus || 'unpaid',
            timestamp: data.timestamp,
            paymentMethod: data.paymentMethod || 'Cash'
          });
        });
        console.log('Setting orders state with', ordersData.length, 'orders');
        setOrders(ordersData);
        updatePaymentStats(ordersData);
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
    try {
      console.log('Updating payment status:', orderId, 'to', newStatus);
      const orderRef = doc(firestore, 'orders', orderId);
      await updateDoc(orderRef, {
        paymentStatus: newStatus,
        lastUpdated: serverTimestamp()
      });
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
      // Show all orders that are not both completed AND paid
      return !(order.status === 'completed' && order.paymentStatus === 'paid');
    } else if (activeTab === 'completed') {
      return order.status === 'completed' && order.paymentStatus === 'paid';
    } else if (activeTab === 'unpaidCompleted') {
      return order.status === 'completed' && order.paymentStatus === 'unpaid';
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
            {Object.entries(paymentStats.paymentMethods).map(([method, data]) => (
              <div key={method} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FiCreditCard className="text-gray-600" />
                  <span className="text-sm text-gray-800">{method}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-sm text-gray-600">{data.count} orders</span>
                  <span className="text-sm font-medium">₹{data.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 mx-auto">
        <div className="flex overflow-x-auto mb-4 border-b">
          <button 
            onClick={() => setActiveTab('active')} 
            className={`py-2 px-4 ${activeTab === 'active' ? 'text-[#FE4A12] border-b-2 border-[#FE4A12] font-medium' : 'text-gray-500'}`}
          >
            Active Orders
          </button>
          <button 
            onClick={() => setActiveTab('completed')} 
            className={`py-2 px-4 ${activeTab === 'completed' ? 'text-[#FE4A12] border-b-2 border-[#FE4A12] font-medium' : 'text-gray-500'}`}
          >
            Completed Orders
          </button>
          <button 
            onClick={() => setActiveTab('unpaidCompleted')} 
            className={`py-2 px-4 ${activeTab === 'unpaidCompleted' ? 'text-[#FE4A12] border-b-2 border-[#FE4A12] font-medium' : 'text-gray-500'}`}
          >
            Unpaid Completed
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

                  {/* Admin Action Buttons */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {/* Show Order Status Buttons if not completed */}
                    {order.status !== 'completed' ? (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors ${
                            order.status === 'preparing'
                              ? 'bg-[#FE4A12] text-white'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          Preparing
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors ${
                            order.status === 'completed' as Order['status']
                              ? 'bg-[#FE4A12] text-white'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          Completed
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Show Payment Status Buttons if completed */}
                        <button
                          onClick={() => updatePaymentStatus(order.id, 'unpaid')}
                          className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors flex items-center justify-center gap-2 ${
                            order.paymentStatus === 'unpaid'
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          disabled={order.paymentStatus === 'paid'}
                        >
                          <FiAlertCircle />
                          Unpaid
                        </button>
                        <button
                          onClick={() => updatePaymentStatus(order.id, 'paid')}
                          className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors flex items-center justify-center gap-2 ${
                            order.paymentStatus === 'paid'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 text-gray-500 hover:bg-green-200'
                          }`}
                        >
                          <FiDollarSign />
                          Paid
                        </button>
                      </>
                    )}
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