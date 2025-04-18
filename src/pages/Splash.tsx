import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-6 relative"
      style={{ backgroundColor: 'rgba(254, 74, 18, 0.2)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 
          className="text-3xl font-bold mb-4 text-[#212121]"
          style={{ fontFamily: 'Metropolis' }}
        >
          Your Favorite Meals,
          <br />
          Delivered to Your Doorstep
        </h1>
        
        <p 
          className="text-[#424242] mb-8"
          style={{ fontFamily: 'Metropolis' }}
        >
          Discover delicious meals, fast delivery, and exclusive deals—all in one app.
        </p>

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-[#FE4A12] border-t-transparent rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Splash; 