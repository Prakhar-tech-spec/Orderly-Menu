import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface FoodOption {
  id: string;
  name: string;
  price: number;
}

interface FoodItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  options?: FoodOption[];
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface DishInfoProps {
  item: FoodItem;
  addToCart: (item: CartItem) => void;
}

const DishInfo: React.FC<DishInfoProps> = ({ item, addToCart }) => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const handleAddToCart = () => {
    if (selectedOption) {
      const option = item.options?.find(opt => opt.id === selectedOption);
      if (option) {
        addToCart({
          id: `${item.id}-${option.id}`,
          name: `${item.name} (${option.name})`,
          price: option.price,
          quantity: 1,
          image: item.image
        });
      }
    } else {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image
      });
    }
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-20"
    >
      <div className="relative">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-64 object-cover"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-4 py-6"
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-2">{item.name}</h1>
          <p className="text-gray-600 mb-4">{item.description}</p>
          
          {item.options && item.options.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Select Portion</h2>
              <div className="grid grid-cols-2 gap-3">
                {item.options.map((option: FoodOption) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedOption === option.id
                        ? 'border-[#FE4A12] bg-[#FE4A12]/5'
                        : 'border-gray-200 hover:border-[#FE4A12]/50'
                    }`}
                  >
                    <div className="font-medium">{option.name}</div>
                    <div className="text-[#FE4A12] font-semibold">₹{option.price}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-[#FE4A12]">
              ₹{selectedOption 
                ? item.options?.find(opt => opt.id === selectedOption)?.price 
                : item.price}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="bg-[#FE4A12] text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-[#FE4A12]/20"
            >
              Add to Cart
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showAddedMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-4 right-4 bg-white rounded-xl p-4 shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FE4A12]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#FE4A12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Added to Cart</div>
                <div className="text-sm text-gray-500">
                  {selectedOption 
                    ? `${item.name} (${item.options?.find(opt => opt.id === selectedOption)?.name})`
                    : item.name}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/cart')}
              className="text-[#FE4A12] font-semibold"
            >
              View Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DishInfo; 