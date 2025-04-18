import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Data Migration Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Data Management</h2>
        <p className="text-gray-600 mb-4">
          Manage your menu data and migrate it to Firebase.
        </p>
        <Link 
          to="/migrate" 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Migrate Data to Firebase
        </Link>
      </div>

      {/* Menu Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Menu Management</h2>
        <p className="text-gray-600 mb-4">
          Manage your menu items, categories, and prices.
        </p>
        {/* Add menu management features here */}
      </div>

      {/* Order Management */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Order Management</h2>
        <p className="text-gray-600 mb-4">
          View and manage customer orders.
        </p>
        {/* Add order management features here */}
      </div>
    </div>
  );
};

export default AdminPage; 