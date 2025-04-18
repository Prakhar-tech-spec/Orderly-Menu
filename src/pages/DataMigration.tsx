import React, { useState } from 'react';
import { migrateAllData } from '../utils/migrateData';

const DataMigration: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMigration = async () => {
    if (!window.confirm('Are you sure you want to migrate all data to Firebase?')) {
      return;
    }

    setIsLoading(true);
    setStatus('Migration in progress...');

    try {
      const result = await migrateAllData();
      setStatus(result.message);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Data Migration to Firebase</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4 text-gray-600">
          This will migrate all your menu items and categories to Firebase.
          You only need to do this once.
        </p>
        
        <button
          onClick={handleMigration}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Migrating...' : 'Start Migration'}
        </button>

        {status && (
          <p className={`mt-4 ${status.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default DataMigration; 