import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, DocumentData, Query, CollectionReference } from 'firebase/firestore';
import { firestore } from '../config/firebase';

export const useFirebaseData = (collectionName: string, category?: string) => {
  const [data, setData] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let q: Query<DocumentData> | CollectionReference<DocumentData> = collection(firestore, collectionName);
        if (category) {
          q = query(q, where('category', '==', category));
        }
        
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setData(fetchedData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, category]);

  return { data, loading, error };
}; 