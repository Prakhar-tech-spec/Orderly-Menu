import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';

const QRLanding: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/initial');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[#FFF8F6] opacity-50">
        <div className="absolute inset-0 opacity-5 pattern-dots pattern-gray-900 pattern-bg-white pattern-size-4 pattern-spacing-4" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 px-4"
      >
        {/* Success Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-[#FE4A12] rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <FiCheck className="text-white text-3xl" />
        </motion.div>

        {/* Main Text */}
        <h1 
          className="text-[28px] font-bold mb-4 text-[#212121]"
        >
          QR Code Scanned Successfully
        </h1>
        
        <p 
          className="text-[16px] mb-8 text-[#424242]"
        >
          Get ready to explore our delicious menu
        </p>

        {/* Countdown */}
        <motion.p 
          className="text-gray-500"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Redirecting in {countdown}...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default QRLanding; 