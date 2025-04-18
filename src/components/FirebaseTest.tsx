import React, { useEffect, useState } from 'react';
import { firestore } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const FirebaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking connection...');
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try to fetch data from Firestore
        const testCollection = collection(firestore, 'test');
        const snapshot = await getDocs(testCollection);
        
        // If we get here without errors, the connection is successful
        setConnectionStatus('Connected to Firebase successfully!');
        
        // Store any data we found
        const testData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(testData);
      } catch (error: any) {
        console.error('Firebase connection error:', error);
        setConnectionStatus(`Connection error: ${error.message || 'Unknown error'}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Firebase Connection Test</h2>
      <p className={`mb-4 ${connectionStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
        {connectionStatus}
      </p>
      
      {data.length > 0 ? (
        <div>
          <h3 className="font-semibold mb-2">Test Data:</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ) : (
        <p className="text-gray-500">No test data found. This is normal if the 'test' collection doesn't exist.</p>
      )}
    </div>
  );
};

export default FirebaseTest; 