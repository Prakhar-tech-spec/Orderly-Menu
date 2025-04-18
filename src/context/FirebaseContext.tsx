import React, { createContext, useContext, useState, useEffect } from 'react';
import { firestore } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface FirebaseContextType {
  menuItems: any[];
  categories: any[];
  loading: boolean;
  error: string | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  menuItems: [],
  categories: [],
  loading: true,
  error: null
});

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch menu items
        const menuSnapshot = await getDocs(collection(firestore, 'menuItems'));
        const menuData = menuSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMenuItems(menuData);

        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(firestore, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <FirebaseContext.Provider value={{ menuItems, categories, loading, error }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext); 