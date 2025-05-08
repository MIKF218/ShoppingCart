import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';
import { AuthProvider } from './src/context/AuthContext';
import { Platform, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { initializeDatabase, checkDatabaseProducts, testDatabaseConnection, resetDatabase } from './src/utils/initializeDatabase';

// Remove the problematic import and replace with proper web setup
if (Platform.OS === 'web') {
  const { GestureHandlerRootView } = require('react-native-gesture-handler');
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        console.log('Setting up database...');
        setIsLoading(true);
        
        // First test the connection
        const isConnected = await testDatabaseConnection();
        if (!isConnected) {
          throw new Error('Failed to connect to database. Please check your Firebase configuration.');
        }
        
        // Reset database with new products
        console.log('Resetting database with new products...');
        const resetSuccessful = await resetDatabase();
        if (!resetSuccessful) {
          throw new Error('Failed to reset database');
        }
        
        // Check the products
        const products = await checkDatabaseProducts();
        console.log(`Database setup complete. Found ${products?.length || 0} products.`);
        
      } catch (error) {
        console.error('Database setup failed:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    setupDatabase();
  }, []);

  const AppWrapper = Platform.OS === 'web' ? React.Fragment : SafeAreaProvider;

  // Show loading state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <AppWrapper>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </AppWrapper>
  );
};

export default App;