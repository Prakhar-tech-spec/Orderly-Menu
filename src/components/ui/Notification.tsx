import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';

interface NotificationProps {
  message: string;
  show: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

const Notification: React.FC<NotificationProps> = ({ message, show, onClose, type = 'success' }) => {
  if (!show) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-24 left-4 right-4 ${bgColor} text-white px-6 py-4 rounded-xl shadow-lg text-center`}
    >
      {message}
    </motion.div>
  );
};

export default Notification; 