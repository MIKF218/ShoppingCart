import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type OrderSuccessScreenProps = NativeStackScreenProps<RootStackParamList, 'OrderSuccess'>;

const OrderSuccessScreen: React.FC<OrderSuccessScreenProps> = ({ navigation }) => {
  useEffect(() => {
    // Automatically navigate to home screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
      </View>
      <Text style={styles.title}>Order Placed!</Text>
      <Text style={styles.message}>Your order has been placed successfully!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainApp' }],
          });
        }}
      >
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderSuccessScreen; 