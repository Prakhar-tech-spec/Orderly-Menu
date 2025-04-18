import { collection, addDoc, getDocs } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { foodItems, categories } from '../data/foodItems';

export const migrateAllData = async () => {
  try {
    console.log('Starting data migration...');
    
    // Migrate menu items
    console.log('Migrating menu items...');
    const menuItemsCollection = collection(firestore, 'menuItems');
    
    // Check if items already exist
    const existingItems = await getDocs(menuItemsCollection);
    if (existingItems.empty) {
      // Add all menu items
      for (const item of foodItems) {
        await addDoc(menuItemsCollection, item);
      }
      console.log(`Successfully migrated ${foodItems.length} menu items`);
    } else {
      console.log('Menu items already exist, skipping...');
    }
    
    // Migrate categories
    console.log('Migrating categories...');
    const categoriesCollection = collection(firestore, 'categories');
    
    // Check if categories already exist
    const existingCategories = await getDocs(categoriesCollection);
    if (existingCategories.empty) {
      // Add all categories
      for (const category of categories) {
        await addDoc(categoriesCollection, category);
      }
      console.log(`Successfully migrated ${categories.length} categories`);
    } else {
      console.log('Categories already exist, skipping...');
    }
    
    return {
      success: true,
      message: 'Data migration completed successfully!'
    };
  } catch (error: any) {
    console.error('Error during migration:', error);
    return {
      success: false,
      message: `Migration failed: ${error.message}`
    };
  }
}; 