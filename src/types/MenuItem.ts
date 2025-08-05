export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  ingredients: string;
  instructions: string;
  presentation: string;
  shelfLife: string;
  packaging?: string;
  isGlutenFree: boolean;
  isSugarFree: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuFormData {
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  ingredients: string;
  instructions: string;
  presentation: string;
  shelfLife: string;
  packaging: string;
  isGlutenFree: boolean;
  isSugarFree: boolean;
} 