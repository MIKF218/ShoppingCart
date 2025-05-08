import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { Platform } from 'react-native';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1u288MeasC8ads8EDKe3AQ0f64VJZPRE",
  authDomain: "ecommerce-b4ca9.firebaseapp.com",
  databaseURL: "https://ecommerce-b4ca9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ecommerce-b4ca9",
  storageBucket: "ecommerce-b4ca9.firebasestorage.app",
  messagingSenderId: "992314012392",
  appId: "1:992314012392:web:b04f7a45dcc5e5b1e00f5d",
  measurementId: "G-3PFPVJCWWZ"
};

// Initialize Firebase
let app: FirebaseApp;
let db: Database;

try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Export initialized instances
export { db };
export default app;