import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';
import { foodItems } from '../data/foodItems';
import { useCart } from '../context/CartContext';
import Notification from '../components/ui/Notification';

const DishDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  // State
  const [quantity, setQuantity] = useState(1);
  const [selectedPortion, setSelectedPortion] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  
  // Find the dish
  const dish = foodItems.find(item => item.id === id);
  
  // If dish not found
  if (!dish) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-4">Dish not found</h2>
        <button
          onClick={() => navigate('/menu')}
          className="px-6 py-3 bg-[#FE4A12] text-white rounded-xl font-medium"
        >
          Back to Menu
        </button>
      </div>
    );
  }
  
  // Extract portion options (Full, Half, Quarter) and other options
  const portionOptions = useMemo(() => {
    // If no options at all, return empty array
    if (!dish.options || dish.options.length === 0) return [];
    
    // Get existing portion options
    const existingPortions = dish.options.filter(option => 
      ['Full', 'Half', 'Quarter'].some(name => option.name.includes(name))
    );
    
    // Check if we have Half or Quarter but no Full option
    const hasHalf = existingPortions.some(opt => opt.name.includes('Half'));
    const hasQuarter = existingPortions.some(opt => opt.name.includes('Quarter'));
    const hasFull = existingPortions.some(opt => opt.name.includes('Full'));
    
    // If we have Half or Quarter but no Full, add a Full option
    if ((hasHalf || hasQuarter) && !hasFull) {
      // Create a synthetic Full option
      const fullOption = {
        id: 'full-option',
        name: 'Full',
        price: dish.price
      };
      return [fullOption, ...existingPortions];
    }
    
    return existingPortions;
  }, [dish]);
  
  const additionalOptions = dish.options?.filter(option => 
    !['Full', 'Half', 'Quarter'].some(name => option.name.includes(name))
  ) || [];
  
  // Set default portion when component mounts
  useEffect(() => {
    if (portionOptions.length > 0) {
      // Default to Full if available, otherwise first option
      const fullOption = portionOptions.find(opt => opt.name.includes('Full'));
      setSelectedPortion(fullOption?.id || portionOptions[0].id);
    }
  }, [portionOptions]);
  
  // Calculate price for selected portion
  const getPortionPrice = () => {
    // If no portion options or no selection, use the base price
    if (portionOptions.length === 0 || !selectedPortion) {
      return dish.price;
    }
    
    // Find the selected portion option
    const selected = portionOptions.find(opt => opt.id === selectedPortion);
    return selected ? selected.price : dish.price;
  };
  
  // Calculate total price including quantity and additional options
  const calculateTotalPrice = () => {
    const basePrice = getPortionPrice();
    
    // Add prices of additional selected options
    const additionalPrice = selectedOptions.reduce((total, optionId) => {
      const option = additionalOptions.find(opt => opt.id === optionId);
      return total + (option?.price || 0);
    }, 0);
    
    return (basePrice + additionalPrice) * quantity;
  };
  
  // Handle portion selection
  const handlePortionSelect = (portionId: string) => {
    setSelectedPortion(portionId);
  };
  
  // Toggle additional options
  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId) 
        : [...prev, optionId]
    );
  };
  
  // Add to cart
  const handleAddToCart = () => {
    // If portions are available, require selection
    if (portionOptions.length > 0 && !selectedPortion) {
      // Could show an error message here
      return;
    }
    
    // Find the selected portion details
    const selectedPortionDetails = portionOptions.find(opt => opt.id === selectedPortion);
    
    // Create cart item name with portion if applicable
    let itemName = dish.name;
    if (selectedPortionDetails) {
      itemName = `${dish.name} (${selectedPortionDetails.name})`;
    }
    
    // Create unique cart item ID
    const cartItemId = selectedPortionDetails 
      ? `${dish.id}-${selectedPortionDetails.name}` 
      : dish.id;
    
    // Get selected additional options
    const selectedOptionDetails = selectedOptions.map(optionId => {
      const option = additionalOptions.find(opt => opt.id === optionId);
      return {
        name: option?.name || '',
        price: option?.price || 0
      };
    });
    
    // Create cart item
    const cartItem = {
      id: cartItemId,
      name: itemName,
      price: getPortionPrice(),
      quantity,
      category: dish.category,
      selectedOptions: selectedOptionDetails,
      notes: notes.trim()
    };
    
    // Add to cart
    addItem(cartItem);
    
    // Show notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
    
    // Reset states (optional)
    setQuantity(1);
    setSelectedOptions([]);
    // Keep the selected portion to avoid confusion
  };
  
  // Get the name of the selected portion for display
  const getSelectedPortionName = () => {
    if (!selectedPortion) return '';
    const portion = portionOptions.find(opt => opt.id === selectedPortion);
    return portion ? portion.name : '';
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-10 p-3 bg-white rounded-full shadow-md"
      >
        <FiArrowLeft className="text-gray-700 text-xl" />
      </motion.button>

      {/* Dish Image */}
      <div className="relative w-full h-64 md:h-80">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Dish Info */}
      <div className="p-4 bg-white rounded-t-2xl -mt-6 relative z-0 shadow-lg">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">{dish.name}</h1>
        <p className="text-gray-600 mb-4">{dish.description}</p>
        
        {/* Base Price - Only show if no portions */}
        {portionOptions.length === 0 && (
          <p className="text-xl font-semibold text-[#FE4A12] mb-4">₹{dish.price.toFixed(2)}</p>
        )}

        {/* Portion Selection */}
        {portionOptions.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">Select Portion</h2>
            <div className="flex flex-wrap gap-3">
              {/* Sort the portions to ensure they appear in order: Full, Half, Quarter */}
              {[...portionOptions].sort((a, b) => {
                // Custom sort function to prioritize Full > Half > Quarter
                const getOrder = (name: string) => {
                  if (name.includes('Full')) return 1;
                  if (name.includes('Half')) return 2;
                  if (name.includes('Quarter')) return 3;
                  return 4; // Any other options
                };
                return getOrder(a.name) - getOrder(b.name);
              }).map(portion => (
                <button
                  key={portion.id}
                  onClick={() => handlePortionSelect(portion.id)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 ${
                    selectedPortion === portion.id
                      ? 'bg-[#FE4A12] text-white border-[#FE4A12]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {portion.name} - ₹{portion.price.toFixed(2)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Additional Options */}
        {additionalOptions.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">Additional Options</h2>
            <div className="space-y-3">
              {additionalOptions.map(option => (
                <div
                  key={option.id}
                  className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                >
                  <label htmlFor={option.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id={option.id}
                      checked={selectedOptions.includes(option.id)}
                      onChange={() => handleOptionToggle(option.id)}
                      className="mr-3 h-5 w-5 text-[#FE4A12] focus:ring-[#FE4A12] border-gray-300 rounded"
                    />
                    <span className="text-gray-700">{option.name}</span>
                  </label>
                  <span className="text-gray-600 font-medium">+ ₹{option.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Special Instructions</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g., Extra spicy, no onions..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FE4A12] focus:border-[#FE4A12] text-sm"
            rows={3}
          ></textarea>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-700">Quantity</h2>
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#FE4A12] text-xl shadow"
              disabled={quantity <= 1}
            >
              <FiMinus />
            </button>
            <span className="text-lg font-semibold w-8 text-center text-gray-800">{quantity}</span>
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#FE4A12] text-xl shadow"
            >
              <FiPlus />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Footer - Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-top z-10">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-800">
            Total: ₹{(portionOptions.length > 0 && !selectedPortion) ? '0.00' : calculateTotalPrice().toFixed(2)}
            {portionOptions.length > 0 && !selectedPortion && (
              <span className="text-sm text-gray-500 ml-1">(Select Portion)</span>
            )}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={portionOptions.length > 0 && !selectedPortion}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition-colors duration-200 ${
              portionOptions.length > 0 && !selectedPortion
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#FE4A12] hover:bg-[#E0430F]'
            }`}
          >
            {portionOptions.length > 0 && !selectedPortion
              ? 'Select Portion'
              : `Add ${quantity} to Cart`}
          </button>
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <Notification
            message="Added To Cart"
            show={showNotification}
            onClose={() => setShowNotification(false)}
            type="success"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DishDetails;