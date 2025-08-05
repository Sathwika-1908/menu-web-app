import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration for "THE HOUSE OF TOVIO" project
const firebaseConfig = {
  apiKey: "AIzaSyAE3ewoDEKKZW6PfLq9VWr0qYMkhsWavHc",
  authDomain: "the-house-of-tovio.firebaseapp.com",
  databaseURL: "https://the-house-of-tovio-default-rtdb.firebaseio.com",
  projectId: "the-house-of-tovio",
  storageBucket: "the-house-of-tovio.firebasestorage.app",
  messagingSenderId: "638466303348",
  appId: "1:638466303348:web:f5de324f3f722f71cd7821",
  measurementId: "G-P2664PCGB5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app);

export default app; 