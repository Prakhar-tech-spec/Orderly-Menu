import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiHeart } from 'react-icons/fi';
import { foodItems, homePageCategories } from '../data/foodItems';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pt-4">
      {/* Header */}
      <div className="px-4 space-y-4">
        {/* Location Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-[#FE4A12]" />
            <div>
              <p className="text-xs text-gray-500">Your location</p>
              <div className="flex items-center gap-1">
                <p className="font-medium text-sm">Raja Dhaba</p>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Type to search"
              className="w-full py-3 px-4 pl-11 bg-gray-50 rounded-full text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 text-sm text-gray-500">
              Now
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
              </svg>
            </button>
            <button className="w-10 h-10 bg-[#FE4A12] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                <path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="px-4 mt-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#FE4A12] rounded-2xl p-6 text-white relative overflow-hidden h-[180px]"
        >
          <div className="flex justify-between items-start relative z-20">
            <div className="max-w-[60%]">
              <p className="text-sm font-medium mb-2">Raja Dhaba</p>
              <h2 className="text-2xl font-bold">Not Just a Dhaba,<br />It's a Mood!</h2>
            </div>
          </div>
          
          {/* Food Image with Tilt Effect */}
          <motion.div
            className="absolute -right-6 -bottom-6 w-52 h-52 z-10"
            animate={{ 
              rotate: [0, 2, 0, -2, 0],
              y: [0, -5, 0, -5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.img 
              src="/images/PCS_academy__waiting_list-removebg-preview.png"
              alt="Delicious Food"
              className="w-full h-full object-contain transform rotate-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))',
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            />
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full opacity-30 blur-sm" />
            <div className="absolute top-1/2 -left-6 w-6 h-6 bg-orange-300 rounded-full opacity-20 blur-sm" />
          </motion.div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)'
            }} />
          </div>
        </motion.div>
      </div>

      {/* Category Icons */}
      <div className="px-4 mt-6">
        <div className="grid grid-cols-4 gap-3">
          {homePageCategories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/menu?category=${category.name}`)}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <motion.div 
                className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center"
                style={{ backgroundColor: category.bg }}
              >
                <span className="text-2xl">{category.icon}</span>
              </motion.div>
              <span className="text-xs font-medium text-center">{category.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Popular Food Section */}
      <div className="px-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Popular Food</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/menu')}
            className="text-[#FE4A12] text-sm font-medium"
          >
            See All
          </motion.button>
        </div>
        
        {/* Food Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative rounded-2xl overflow-hidden bg-black h-48"
        >
          <motion.img
            src={foodItems[0].image}
            alt="Pizza"
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
            <span className="text-white text-sm">₹{foodItems[0].price}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white font-medium text-lg">{foodItems[0].name}</h3>
              <p className="text-white/80 text-sm">Fresh & Delicious</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <FiHeart className="text-gray-600" />
              </button>
              <button className="px-4 py-2 bg-[#FE4A12] rounded-full text-white text-sm font-medium shadow-lg">
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home; 