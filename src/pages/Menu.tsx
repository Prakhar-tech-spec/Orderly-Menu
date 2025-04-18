import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { foodItems } from '../data/foodItems';

// Memoize the categories array once as a constant
const categories = ['All', 'Veg', 'Paneer ka Jayaka', 'Mushroom / Chaap', 'Non Veg', 'Chicken / Mutton Main Course', 'Ande ka Funda', 'Chinese', 'Chapatiyan', 'Desserts', 'Salad', 'Thali'];

// Helper functions for filtering and grouping
const getFilteredItems = (items: typeof foodItems, category: string) => {
  if (category === 'All') return items;
  
  // Return items matching the selected category
  return items.filter(item => item.category === category);
};

const getGroupedItems = (items: typeof foodItems) => {
  // Group items by subcategory
  const grouped = items.reduce((acc, item) => {
    // Use 'Other' as fallback if no subcategory exists
    const subcategory = item.subcategory || 'Other';
    
    if (!acc[subcategory]) {
      acc[subcategory] = [];
    }
    
    acc[subcategory].push(item);
    return acc;
  }, {} as Record<string, typeof foodItems>);
  
  // Convert to array of [subcategory, items] pairs
  // Sort subcategories alphabetically for consistent ordering
  return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]));
};

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get category from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [location.search]);

  // Memoize filtered items
  const filteredItems = useMemo(() => 
    getFilteredItems(foodItems, selectedCategory),
    [selectedCategory]
  );

  // Memoize grouped items for categories with subcategories
  const groupedItems = useMemo(() => {
    // Check if any items have subcategories
    const hasSubcategories = filteredItems.some(item => item.subcategory);
    
    // If no items or no subcategories, don't group
    if (filteredItems.length === 0 || !hasSubcategories) return null;
    
    // Otherwise, group by subcategory
    return getGroupedItems(filteredItems);
  }, [filteredItems]);

  const handleCategoryChange = useCallback((category: string) => {
    console.log(`Category changed to: ${category}`);
    setSelectedCategory(category);
    navigate(`/menu${category === 'All' ? '' : `?category=${category}`}`);
  }, [navigate]);

  const handleItemClick = useCallback((id: string) => {
    navigate(`/dish/${id}`);
  }, [navigate]);

  // Memoize the category buttons
  const categoryButtons = useMemo(() => (
    categories.map(category => (
      <button
        key={category}
        onClick={() => handleCategoryChange(category)}
        className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-200 ${
          selectedCategory === category
            ? 'bg-[#FE4A12] text-white font-medium'
            : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
        }`}
      >
        {category}
      </button>
    ))
  ), [selectedCategory, handleCategoryChange]);

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4">Our Menu</h1>
      
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {categoryButtons}
      </div>

      <div key={`category-${selectedCategory}`} className="grid gap-4">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-gray-500 text-lg">No items found in this category</p>
            <button 
              onClick={() => handleCategoryChange('All')}
              className="mt-4 px-4 py-2 bg-[#FE4A12] text-white rounded-lg"
            >
              View All Items
            </button>
          </div>
        ) : groupedItems ? (
          // Render grouped items for categories with subcategories
          groupedItems.map(([subcategory, items]) => (
            <div key={`${selectedCategory}-${subcategory}`} className="space-y-3">
              <h2 className="text-xl font-bold text-[#FE4A12]">{subcategory}</h2>
              <div className="grid gap-3">
                {items.map((item) => (
                  <div
                    key={`${selectedCategory}-${subcategory}-${item.id}`}
                    onClick={() => handleItemClick(item.id)}
                    className="bg-white rounded-2xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:scale-[1.01]"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold mb-1">{item.name}</h2>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center">
                          <span className="text-[#FE4A12] font-semibold">
                            ₹{item.price.toFixed(2)}
                          </span>
                          {item.options && (
                            <span className="text-xs text-gray-500 ml-2">
                              (Options available)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          // Regular grid for other categories
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="bg-white rounded-2xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:scale-[1.01]"
            >
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-1">{item.name}</h2>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center">
                    <span className="text-[#FE4A12] font-semibold">
                      ₹{item.price.toFixed(2)}
                    </span>
                    {item.options && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Options available)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(Menu); 