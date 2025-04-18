import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { foodItems } from '../data/foodItems';

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Search Header */}
      <div className="px-4 pt-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to search..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FE4A12]"
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="px-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Search Results</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/menu')}
            className="text-[#FE4A12] text-sm font-medium"
          >
            See All
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/dish/${item.id}`)}
              className="bg-white rounded-xl border overflow-hidden"
            >
              <div className="relative h-32">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg"
                >
                  <FiHeart
                    className={`text-xl ${
                      favorites.includes(item.id) ? 'text-[#FE4A12]' : 'text-gray-400'
                    }`}
                  />
                </motion.button>
              </div>
              <div className="p-3">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search; 