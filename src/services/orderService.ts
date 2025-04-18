import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../config/firebase';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  options?: {
    name: string;
    price: number;
  }[];
}

export interface OrderData {
  customerName: string;
  contactNumber: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
}

export const submitOrder = async (orderData: OrderData) => {
  try {
    const orderWithTimestamp = {
      ...orderData,
      status: 'pending',
      orderTime: serverTimestamp(),
    };

    const docRef = await addDoc(collection(firestore, 'orders'), orderWithTimestamp);
    
    return {
      success: true,
      orderId: docRef.id,
      message: 'Order placed successfully!'
    };
  } catch (error: any) {
    console.error('Error submitting order:', error);
    return {
      success: false,
      message: error.message || 'Failed to place order'
    };
  }
}; 