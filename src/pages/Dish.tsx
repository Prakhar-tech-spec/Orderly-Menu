import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { foodItems } from '../data/foodItems';

const Dish: React.FC = () => {
  const { colors } = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Memoize the dish data
  const dish = useMemo(() => 
    foodItems.find(item => item.id === id),
    [id]
  );

  // Memoize the total price calculation
  const totalPrice = useMemo(() => {
    if (!dish) return 0;
    const basePrice = dish.price;
    const optionPrice = selectedOption 
      ? dish.options?.find(opt => opt.id === selectedOption)?.price || 0 
      : 0;
    return (basePrice + optionPrice) * quantity;
  }, [dish, selectedOption, quantity]);

  const handleOptionSelect = useCallback((optionId: string) => {
    setSelectedOption(optionId);
  }, []);

  const handleQuantityChange = useCallback((change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  }, []);

  const handleAddToCart = useCallback(() => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', {
      dish,
      selectedOption,
      quantity,
      totalPrice
    });
  }, [dish, selectedOption, quantity, totalPrice]);

  if (!dish) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-4 text-center"
      >
        <h1 className="text-2xl font-bold mb-4">Dish not found</h1>
        <button
          onClick={() => navigate('/menu')}
          className="px-4 py-2 bg-[#FE4A12] text-white rounded-full"
        >
          Back to Menu
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="p-4 pb-24"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative w-full h-64 rounded-2xl overflow-hidden mb-4"
      >
        <motion.img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover"
          loading="lazy"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div>
          <h1 className="text-2xl font-bold mb-2">{dish.name}</h1>
          <p className="text-gray-600">{dish.description}</p>
        </div>

        {dish.options && dish.options.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <h2 className="text-lg font-semibold">Options</h2>
            <div className="flex flex-wrap gap-2">
              {dish.options.map(option => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedOption === option.id
                      ? 'bg-[#FE4A12] text-white'
                      : 'border border-gray-300 text-gray-700'
                  }`}
                >
                  {option.name} (+₹{option.price})
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
            >
              -
            </button>
            <span className="w-8 text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300"
            >
              +
            </button>
          </div>
          <span className="text-xl font-bold text-[#FE4A12]">
            ₹{totalPrice.toFixed(2)}
          </span>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className="w-full py-3 bg-[#FE4A12] text-white rounded-full font-semibold"
        >
          Add to Cart
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(Dish); 