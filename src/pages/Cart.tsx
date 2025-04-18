import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { useUser } from '../context/UserContext';
import Notification from '../components/ui/Notification';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: {
    name: string;
    price: number;
  }[];
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const { tableNumber, validateAndSetTableNumber, userIP, deviceId } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string>('');
  const [inputTableNumber, setInputTableNumber] = useState(tableNumber || '');
  const [error, setError] = useState<string>('');

  const calculateItemTotal = (item: CartItem) => {
    const baseTotal = item.price * item.quantity;
    const optionsTotal = item.selectedOptions?.reduce((sum, option) => sum + option.price, 0) || 0;
    return baseTotal + (optionsTotal * item.quantity);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    removeItem(itemId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting order submission...'); // Debug log
    
    if (!inputTableNumber) {
      setError('Please enter a table number');
      return;
    }

    if (!validateAndSetTableNumber(inputTableNumber)) {
      setError('Please enter a valid table number (minimum 1)');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      console.log('Preparing order data with items:', items); // Debug log
      
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions || []
        })),
        tableNumber: inputTableNumber,
        totalAmount: calculateTotal(),
        status: 'pending',
        paymentStatus: 'unpaid',
        paymentMethod: 'Cash',
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
        userIP: userIP || 'unknown',
        deviceId: deviceId || 'unknown'
      };

      console.log('Order data prepared:', orderData); // Debug log

      // Add to Firebase
      const ordersRef = collection(firestore, 'orders');
      console.log('Adding order to Firestore...'); // Debug log
      
      const docRef = await addDoc(ordersRef, orderData);
      console.log('Order successfully created with ID:', docRef.id);

      // Clear cart and show success
      clearCart();
      setInputTableNumber('');
      setOrderStatus('Order placed successfully!');
      console.log('Cart cleared and order status updated');

      // Redirect to orders page after delay
      setTimeout(() => {
        setOrderStatus('');
        navigate('/orders');
        console.log('Redirecting to orders page...');
      }, 2000);

    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your cart is empty</h2>
        <p className="text-gray-600">Add some delicious items to get started!</p>
        <button
          onClick={() => navigate('/menu')}
          className="mt-6 px-6 py-3 bg-[#FE4A12] text-white rounded-xl font-medium"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <h1 className="text-xl font-semibold">Your Cart</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-[480px] mx-auto">
        {/* Cart Items */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      {item.selectedOptions.map(option => option.name).join(', ')}
                    </div>
                  )}
                  <div className="text-[#FE4A12] font-medium mt-1">
                    ₹{calculateItemTotal(item).toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      <FiMinus className="text-gray-600" />
                    </motion.button>
                    <span className="font-medium w-6 text-center">{item.quantity}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      <FiPlus className="text-gray-600" />
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <FiTrash2 />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Table Number Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Table Number</h2>
          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={inputTableNumber}
                onChange={(e) => {
                  // Only allow numbers
                  if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
                    setInputTableNumber(e.target.value);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FE4A12] focus:ring-1 focus:ring-[#FE4A12]"
                placeholder="Enter your table number"
                required
              />
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={clearCart}
                className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200"
              >
                Clear Cart
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#FE4A12] text-white rounded-xl font-medium disabled:opacity-50 hover:bg-[#fe5c2a]"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>

        <AnimatePresence>
          {orderStatus && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-24 left-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg text-center"
            >
              {orderStatus}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Cart; 