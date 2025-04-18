import React, { useState } from 'react';
import { migrateMenuItemsToFirebase, migrateCategoriesToFirebase, clearCollection } from '../utils/firebaseUtils';

const FirebaseMigration: React.FC = () => {
  const [menuItemsStatus, setMenuItemsStatus] = useState<string>('');
  const [categoriesStatus, setCategoriesStatus] = useState<string>('');
  const [clearStatus, setClearStatus] = useState<string>('');
  const [collectionName, setCollectionName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleMigrateMenuItems = async () => {
    setIsLoading(true);
    setMenuItemsStatus('Migrating menu items...');
    
    try {
      const result = await migrateMenuItemsToFirebase();
      setMenuItemsStatus(result.message);
    } catch (error: any) {
      setMenuItemsStatus(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMigrateCategories = async () => {
    setIsLoading(true);
    setCategoriesStatus('Migrating categories...');
    
    try {
      const result = await migrateCategoriesToFirebase();
      setCategoriesStatus(result.message);
    } catch (error: any) {
      setCategoriesStatus(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCollection = async () => {
    if (!collectionName) {
      setClearStatus('Please enter a collection name');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to clear the ${collectionName} collection? This cannot be undone.`)) {
      return;
    }
    
    setIsLoading(true);
    setClearStatus(`Clearing ${collectionName} collection...`);
    
    try {
      const result = await clearCollection(collectionName);
      setClearStatus(result.message);
    } catch (error: any) {
      setClearStatus(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Firebase Data Migration</h1>
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Menu Items Migration</h2>
          <p className="mb-4 text-gray-600">
            This will migrate all menu items from your local data to Firebase Firestore.
          </p>
          <button
            onClick={handleMigrateMenuItems}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Migrating...' : 'Migrate Menu Items'}
          </button>
          {menuItemsStatus && (
            <p className={`mt-2 ${menuItemsStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {menuItemsStatus}
            </p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Categories Migration</h2>
          <p className="mb-4 text-gray-600">
            This will migrate all categories from your local data to Firebase Firestore.
          </p>
          <button
            onClick={handleMigrateCategories}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Migrating...' : 'Migrate Categories'}
          </button>
          {categoriesStatus && (
            <p className={`mt-2 ${categoriesStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {categoriesStatus}
            </p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Clear Collection</h2>
          <p className="mb-4 text-gray-600">
            This will delete all documents from the specified collection. Use with caution!
          </p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Collection name (e.g., menuItems)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleClearCollection}
              disabled={isLoading || !collectionName}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? 'Clearing...' : 'Clear Collection'}
            </button>
          </div>
          {clearStatus && (
            <p className={`mt-2 ${clearStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {clearStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirebaseMigration; 