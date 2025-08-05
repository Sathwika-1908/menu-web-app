import { 
  ref, 
  push, 
  update, 
  remove, 
  get, 
  onValue,
  set
} from 'firebase/database';
import { database } from '../firebase';
import { MenuItem, MenuFormData } from '../types/MenuItem';

const COLLECTION_NAME = 'menuItems';

export const menuService = {
  // Get all menu items with real-time updates
  subscribeToMenuItems: (callback: (items: MenuItem[]) => void) => {
    const menuItemsRef = ref(database, COLLECTION_NAME);
    
    return onValue(menuItemsRef, (snapshot) => {
      const items: MenuItem[] = [];
      const data = snapshot.val();
      
      if (data) {
        Object.keys(data).forEach((key) => {
          const item = data[key];
          items.push({
            id: key,
            name: item.name,
            price: item.price,
            category: item.category,
            imageUrl: item.imageUrl,
            isAvailable: item.isAvailable,
            ingredients: item.ingredients || '',
            instructions: item.instructions || '',
            presentation: item.presentation || '',
            shelfLife: item.shelfLife || '',
            isGlutenFree: item.isGlutenFree || false,
            isSugarFree: item.isSugarFree || false,
            createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
          });
        });
      }
      
      // Sort by creation date (newest first)
      items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      callback(items);
    });
  },

  // Get a single menu item
  getMenuItem: async (id: string): Promise<MenuItem | null> => {
    try {
      const menuItemRef = ref(database, `${COLLECTION_NAME}/${id}`);
      const snapshot = await get(menuItemRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return {
          id: snapshot.key!,
          name: data.name,
          price: data.price,
          category: data.category,
          imageUrl: data.imageUrl,
          isAvailable: data.isAvailable,
          ingredients: data.ingredients || '',
          instructions: data.instructions || '',
          presentation: data.presentation || '',
          shelfLife: data.shelfLife || '',
          isGlutenFree: data.isGlutenFree || false,
          isSugarFree: data.isSugarFree || false,
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting menu item:', error);
      throw error;
    }
  },

  // Add a new menu item
  addMenuItem: async (menuData: MenuFormData): Promise<string> => {
    try {
      const menuItemsRef = ref(database, COLLECTION_NAME);
      const newItemRef = push(menuItemsRef);
      
      await set(newItemRef, {
        ...menuData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      
      return newItemRef.key!;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  },

  // Update a menu item
  updateMenuItem: async (id: string, menuData: Partial<MenuFormData>): Promise<void> => {
    try {
      const menuItemRef = ref(database, `${COLLECTION_NAME}/${id}`);
      await update(menuItemRef, {
        ...menuData,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  },

  // Delete a menu item
  deleteMenuItem: async (id: string): Promise<void> => {
    try {
      const menuItemRef = ref(database, `${COLLECTION_NAME}/${id}`);
      await remove(menuItemRef);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  },
}; 