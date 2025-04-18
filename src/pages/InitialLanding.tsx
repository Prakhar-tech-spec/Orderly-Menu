import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const InitialLanding: React.FC = () => {
  const navigate = useNavigate();
  const [slideProgress, setSlideProgress] = useState(0);

  const handleSlideComplete = () => {
    if (slideProgress > 75) {
      navigate('/menu');
    }
  };

  return (
    <div className="fixed inset-0 bg-white">
      {/* Main Content */}
      <div className="h-[85vh] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[#FFF8F6] opacity-50">
          <div className="absolute inset-0 opacity-5 pattern-dots pattern-gray-900 pattern-bg-white pattern-size-4 pattern-spacing-4" />
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-[50vh] relative"
        >
          <img
            src="/images/hero-food.jpg"
            alt="Delicious Food"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 pt-8 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[#212121]">
            Your Favorite Meals,<br />
            Delivered to Your Doorstep
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mb-6">
            Discover delicious meals, fast delivery, and exclusive deals—all in one app.
          </p>
        </motion.div>
      </div>

      {/* Bottom Slider Section */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-lg"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-6">
          {/* Slider Pill */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-8" />

          {/* Slider Track */}
          <div className="relative h-14 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-[#FE4A12]"
              style={{ width: `${slideProgress}%` }}
            />
            
            {/* Draggable Button */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDrag={(_, info) => {
                const progress = Math.min(100, Math.max(0, (info.point.x / window.innerWidth) * 100));
                setSlideProgress(progress);
              }}
              onDragEnd={handleSlideComplete}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="material-icons text-[#FE4A12]"
              >
                chevron_right
              </motion.span>
            </motion.div>

            {/* Slider Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-white font-medium">
                Slide to view menu
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InitialLanding; 