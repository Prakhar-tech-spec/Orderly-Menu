import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { foodItems, categories } from '../data/foodItems';

// Function to migrate menu items to Firebase
export const migrateMenuItemsToFirebase = async () => {
  try {
    console.log('Starting menu items migration...');
    
    // Check if items already exist
    const existingItems = await getDocs(collection(firestore, 'menuItems'));
    if (!existingItems.empty) {
      console.log('Menu items already exist in Firebase. Skipping migration.');
      return { success: true, message: 'Menu items already exist in Firebase.' };
    }
    
    // Add each menu item to Firebase
    for (const item of foodItems) {
      await addDoc(collection(firestore, 'menuItems'), item);
    }
    
    console.log(`Successfully migrated ${foodItems.length} menu items to Firebase.`);
    return { success: true, message: `Successfully migrated ${foodItems.length} menu items to Firebase.` };
  } catch (error: any) {
    console.error('Error migrating menu items:', error);
    return { success: false, message: `Error: ${error.message || 'Unknown error'}` };
  }
};

// Function to migrate categories to Firebase
export const migrateCategoriesToFirebase = async () => {
  try {
    console.log('Starting categories migration...');
    
    // Check if categories already exist
    const existingCategories = await getDocs(collection(firestore, 'categories'));
    if (!existingCategories.empty) {
      console.log('Categories already exist in Firebase. Skipping migration.');
      return { success: true, message: 'Categories already exist in Firebase.' };
    }
    
    // Add each category to Firebase
    for (const category of categories) {
      await addDoc(collection(firestore, 'categories'), category);
    }
    
    console.log(`Successfully migrated ${categories.length} categories to Firebase.`);
    return { success: true, message: `Successfully migrated ${categories.length} categories to Firebase.` };
  } catch (error: any) {
    console.error('Error migrating categories:', error);
    return { success: false, message: `Error: ${error.message || 'Unknown error'}` };
  }
};

// Function to clear all data from a collection (use with caution)
export const clearCollection = async (collectionName: string) => {
  try {
    console.log(`Clearing ${collectionName} collection...`);
    
    const snapshot = await getDocs(collection(firestore, collectionName));
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    
    await Promise.all(deletePromises);
    
    console.log(`Successfully cleared ${snapshot.size} documents from ${collectionName}.`);
    return { success: true, message: `Successfully cleared ${snapshot.size} documents from ${collectionName}.` };
  } catch (error: any) {
    console.error(`Error clearing ${collectionName}:`, error);
    return { success: false, message: `Error: ${error.message || 'Unknown error'}` };
  }
}; 