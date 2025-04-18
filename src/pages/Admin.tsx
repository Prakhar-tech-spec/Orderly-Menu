import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiDownload, FiArrowLeft, FiX } from 'react-icons/fi';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, where, deleteDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';

interface Order {
  id: string;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
  status: 'pending' | 'preparing' | 'completed';
  timestamp: any;
  totalAmount: number;
  tableNumber: string;
  paymentMethod: string;
  userIP: string;
  deviceId: string;
}

interface ErrorNotification {
  message: string;
  show: boolean;
}

const FIVE_HOURS_MS = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ErrorNotification>({ message: '', show: false });
  const [activeTab, setActiveTab] = useState<'orders' | 'analytics'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userIP, setUserIP] = useState<string>('');
  const [deviceId, setDeviceId] = useState<string>('');

  // Generate or retrieve device ID
  useEffect(() => {
    const storedDeviceId = localStorage.getItem('deviceId');
    if (storedDeviceId) {
      setDeviceId(storedDeviceId);
    } else {
      const newDeviceId = 'device_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', newDeviceId);
      setDeviceId(newDeviceId);
    }
  }, []);

  // Fetch user's IP address
  useEffect(() => {
    const getIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIP(data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
        setUserIP('unknown');
      }
    };
    getIP();
  }, []);

  // Set up real-time listener for orders with user-specific filtering
  useEffect(() => {
    if (!isAuthenticated) return;

    console.log('Setting up real-time listener for orders...');
    const ordersRef = collection(firestore, 'orders');
    let q;
    
    if (isAuthenticated) {
      // Admin sees all orders
      q = query(ordersRef, orderBy('timestamp', 'desc'));
    } else {
      // Regular users only see their own orders
      q = query(
        ordersRef,
        where('deviceId', '==', deviceId),
        where('userIP', '==', userIP),
        orderBy('timestamp', 'desc')
      );
    }
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        console.log('Received snapshot with', snapshot.size, 'orders');
        const activeOrders: Order[] = [];
        const finishedOrders: Order[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          const order = {
            id: doc.id,
            items: data.items || [],
            tableNumber: data.tableNumber || 'Unknown',
            totalAmount: data.totalAmount || 0,
            status: data.status || 'pending',
            timestamp: data.timestamp,
            paymentMethod: data.paymentMethod || 'Cash',
            userIP: data.userIP || 'unknown',
            deviceId: data.deviceId || 'unknown'
          };
          
          if (order.status === 'completed') {
            finishedOrders.push(order);
          } else {
            activeOrders.push(order);
          }
        });
        
        setOrders(activeOrders);
        setCompletedOrders(finishedOrders);
        setLoading(false);
      },
      (error) => {
        console.error('Error in real-time listener:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up orders subscription...');
      unsubscribe();
    };
  }, [isAuthenticated, deviceId, userIP]);

  // Clear error after 3 seconds
  useEffect(() => {
    if (error.show) {
      const timer = setTimeout(() => {
        setError({ message: '', show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error.show]);

  // Function to check and delete old completed orders
  const deleteOldCompletedOrders = async () => {
    const now = new Date();
    completedOrders.forEach(async (order) => {
      const orderDate = order.timestamp?.toDate?.();
      if (orderDate && (now.getTime() - orderDate.getTime() > FIVE_HOURS_MS)) {
        try {
          await deleteDoc(doc(firestore, 'orders', order.id));
          console.log(`Deleted old completed order: ${order.id}`);
        } catch (error) {
          console.error('Error deleting old order:', error);
        }
      }
    });
  };

  // Set up periodic check for old orders
  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial check
    deleteOldCompletedOrders();

    // Set up interval for periodic checks
    const interval = setInterval(deleteOldCompletedOrders, 15 * 60 * 1000); // Check every 15 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, completedOrders]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Admin@123') {
      setIsAuthenticated(true);
      setPassword('');
      setError({ message: '', show: false });
    } else {
      setError({ message: 'Wrong password. Please try again.', show: true });
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('orders');
  };

  const handleStatusChange = async (orderId: string, newStatus: 'preparing' | 'completed') => {
    try {
      // Update in Firestore
      const orderRef = doc(firestore, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        lastUpdated: serverTimestamp(),
        userIP: userIP,
        deviceId: deviceId,
        completedAt: newStatus === 'completed' ? serverTimestamp() : null
      });
      
      console.log('Order status updated successfully in Firestore');

      // If order is completed, schedule it for deletion after 5 hours
      if (newStatus === 'completed') {
        setTimeout(async () => {
          try {
            const orderDoc = await doc(firestore, 'orders', orderId);
            await deleteDoc(orderDoc);
            console.log(`Deleted completed order after 5 hours: ${orderId}`);
          } catch (error) {
            console.error('Error deleting completed order:', error);
          }
        }, FIVE_HOURS_MS);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError({ message: 'Failed to update order status', show: true });
    }
  };

  const calculateAnalytics = () => {
    // Combine active and completed orders for analytics
    const allOrders = [...orders, ...completedOrders];
    
    // Calculate total earnings from completed orders
    const totalEarnings = allOrders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const totalOrders = allOrders.length;
    const completedOrdersCount = allOrders.filter(order => order.status === 'completed').length;
    const onTimeDeliveryRate = Math.round((completedOrdersCount / totalOrders) * 100) || 0;

    // Calculate daily earnings for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    const dailyEarnings = last7Days.map(date => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Get all orders (both completed and in progress) for this day
      const dayOrders = allOrders.filter(order => {
        const orderDate = order.timestamp?.toDate?.();
        return orderDate && orderDate >= startOfDay && orderDate <= endOfDay;
      });

      // Calculate total amount for completed orders
      const completedAmount = dayOrders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.totalAmount, 0);

      // Calculate total amount for pending/preparing orders
      const pendingAmount = dayOrders
        .filter(order => order.status !== 'completed')
        .reduce((sum, order) => sum + order.totalAmount, 0);

      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: completedAmount,
        pendingAmount: pendingAmount,
        totalAmount: completedAmount + pendingAmount,
        orderCount: dayOrders.length
      };
    });

    // Calculate month-over-month growth using all orders
    const currentMonthEarnings = allOrders
      .filter(order => {
        const orderDate = order.timestamp?.toDate?.();
        const now = new Date();
        return (
          order.status === 'completed' &&
          orderDate &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const lastMonthEarnings = allOrders
      .filter(order => {
        const orderDate = order.timestamp?.toDate?.();
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        return (
          order.status === 'completed' &&
          orderDate &&
          orderDate.getMonth() === lastMonth.getMonth() &&
          orderDate.getFullYear() === lastMonth.getFullYear()
        );
      })
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const monthlyGrowth = lastMonthEarnings === 0
      ? 100
      : ((currentMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100;

    return {
      totalEarnings,
      totalOrders,
      onTimeDeliveryRate,
      dailyEarnings,
      monthlyGrowth: Number(monthlyGrowth.toFixed(1))
    };
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto mt-20"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          
          {/* Error Notification */}
          <AnimatePresence>
            {error.show && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 relative"
              >
                <button
                  onClick={() => setError({ message: '', show: false })}
                  className="absolute right-2 top-2 text-red-400 hover:text-red-500"
                >
                  <FiX />
                </button>
                <p className="text-red-600 text-sm">{error.message}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FE4A12]"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-[#FE4A12] text-white rounded-xl font-medium"
              type="submit"
            >
              Login
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  const { totalEarnings, totalOrders, onTimeDeliveryRate, dailyEarnings, monthlyGrowth } = calculateAnalytics();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FiLogOut className="text-xl text-[#FE4A12]" />
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'orders'
              ? 'text-[#FE4A12] border-b-2 border-[#FE4A12]'
              : 'text-gray-500'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'analytics'
              ? 'text-[#FE4A12] border-b-2 border-[#FE4A12]'
              : 'text-gray-500'
          }`}
        >
          Analytics
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'orders' ? (
          <motion.div
            key="orders"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4"
          >
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  className="bg-white rounded-xl border p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Table {order.tableNumber}</p>
                      <p className="text-sm text-gray-500">
                        {order.timestamp?.toDate?.() 
                          ? order.timestamp.toDate().toLocaleString()
                          : 'Processing...'}
                      </p>
                    </div>
                    <p className="font-medium">₹{order.totalAmount.toFixed(2)}</p>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusChange(order.id, 'preparing')}
                      className={`flex-1 py-2 rounded-full text-sm font-medium ${
                        order.status === 'preparing'
                          ? 'bg-[#FE4A12] text-white'
                          : 'bg-gray-100'
                      } ${order.status === 'completed' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={order.status === 'completed'}
                    >
                      Preparing
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusChange(order.id, 'completed')}
                      className={`flex-1 py-2 rounded-full text-sm font-medium ${
                        order.status === 'completed'
                          ? 'bg-[#FE4A12] text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      Completed
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-4 space-y-6"
          >
            {/* Total Income */}
            <div className="bg-white rounded-xl border p-4">
              <p className="text-sm text-gray-500">Total Income</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold">₹{totalEarnings.toFixed(2)}</h2>
                <span className={`text-sm ${monthlyGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {monthlyGrowth >= 0 ? '↑' : '↓'} {Math.abs(monthlyGrowth)}% than last month
                </span>
              </div>
            </div>

            {/* Orders Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border p-4">
                <p className="text-sm text-gray-500">Total Orders</p>
                <h3 className="text-xl font-bold">{totalOrders}</h3>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <p className="text-sm text-gray-500">On-time Delivery</p>
                <h3 className="text-xl font-bold">{onTimeDeliveryRate}%</h3>
              </div>
            </div>

            {/* Income Trend Graph */}
            <div className="bg-white rounded-xl border p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Income Trend</h3>
                <div className="text-sm text-gray-500">7-Day Trend</div>
              </div>
              <div className="h-60 relative">
                {/* Grid Background */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />

                {/* Dotted Line Graph */}
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                  {/* Dotted Lines */}
                  {dailyEarnings.map((day, i) => {
                    if (i === dailyEarnings.length - 1) return null;
                    const x1 = (i / (dailyEarnings.length - 1)) * 100;
                    const x2 = ((i + 1) / (dailyEarnings.length - 1)) * 100;
                    const maxAmount = Math.max(...dailyEarnings.map(d => d.totalAmount));
                    const y1 = maxAmount === 0 ? 0 : ((maxAmount - dailyEarnings[i].totalAmount) / maxAmount) * 100;
                    const y2 = maxAmount === 0 ? 0 : ((maxAmount - dailyEarnings[i + 1].totalAmount) / maxAmount) * 100;
                    
                    return (
                      <g key={i}>
                        <line
                          x1={`${x1}%`}
                          y1={`${y1}%`}
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke="#FE4A12"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />
                      </g>
                    );
                  })}

                  {/* Data Points */}
                  {dailyEarnings.map((day, i) => {
                    const x = (i / (dailyEarnings.length - 1)) * 100;
                    const maxAmount = Math.max(...dailyEarnings.map(d => d.totalAmount));
                    const y = maxAmount === 0 ? 0 : ((maxAmount - day.totalAmount) / maxAmount) * 100;
                    
                    return (
                      <g key={i}>
                        <circle
                          cx={`${x}%`}
                          cy={`${y}%`}
                          r="4"
                          fill="white"
                          stroke="#FE4A12"
                          strokeWidth="2"
                        />
                        {/* Tooltip */}
                        <g className="opacity-0 hover:opacity-100 transition-opacity">
                          <rect
                            x={`${x}%`}
                            y={`${y - 10}%`}
                            transform="translate(-40, -40)"
                            width="80"
                            height="30"
                            rx="4"
                            fill="rgba(0,0,0,0.8)"
                          />
                          <text
                            x={`${x}%`}
                            y={`${y - 10}%`}
                            transform="translate(0, -25)"
                            fill="white"
                            fontSize="12"
                            textAnchor="middle"
                          >
                            ₹{day.totalAmount.toFixed(0)}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>

                {/* Y-axis Labels */}
                <div className="absolute -left-2 inset-y-0 w-16 flex flex-col justify-between text-xs text-gray-500">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const maxAmount = Math.max(...dailyEarnings.map(d => d.totalAmount));
                    const amount = (maxAmount * (4 - i)) / 4;
                    return (
                      <div key={i} className="transform -translate-y-1/2">
                        ₹{amount.toFixed(0)}
                      </div>
                    );
                  })}
                </div>

                {/* X-axis Labels */}
                <div className="absolute bottom-0 inset-x-0 flex justify-between text-xs text-gray-500 mt-2">
                  {dailyEarnings.map((day, i) => (
                    <div key={i} className="text-center">
                      <div>{day.day}</div>
                      <div>{day.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage; 