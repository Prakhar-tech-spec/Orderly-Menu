import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { motion } from 'framer-motion';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  options?: {
    name: string;
    price: number;
  }[];
}

interface Order {
  orderId: string;
  customerName: string;
  contactNumber: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  orderTime: any;
  paymentMethod: string;
}

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) throw new Error('No order ID provided');
        
        const orderDoc = await getDoc(doc(firestore, 'orders', orderId));
        
        if (!orderDoc.exists()) {
          throw new Error('Order not found');
        }

        setOrder({
          orderId: orderDoc.id,
          ...orderDoc.data()
        } as Order);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FE4A12] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600">{error || 'Failed to load order details'}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Order Confirmation</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold mb-3">Order Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Order ID:</span> {order.orderId}</p>
              <p><span className="font-medium">Date:</span> {new Date(order.orderTime?.toDate()).toLocaleString()}</p>
              <p><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Delivery Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {order.customerName}</p>
              <p><span className="font-medium">Contact:</span> {order.contactNumber}</p>
              <p><span className="font-medium">Address:</span> {order.deliveryAddress}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start border-b pb-4">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  {item.options?.map((option) => (
                    <p key={option.name} className="text-sm text-gray-600">
                      {option.name} (+₹{option.price})
                    </p>
                  ))}
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  ₹{(item.price + (item.options?.reduce((sum, opt) => sum + opt.price, 0) || 0)) * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-xl font-bold text-[#FE4A12]">₹{order.totalAmount}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderConfirmation; 