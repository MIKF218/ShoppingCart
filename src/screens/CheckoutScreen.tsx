import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type CheckoutScreenProps = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
  const { total, items, clearCart } = useCart();
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: authState.user?.name || '',
    email: authState.user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const handleCheckout = async () => {
    // Validate shipping information
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.state || 
        !shippingInfo.zipCode || !shippingInfo.country || !shippingInfo.phone) {
      Alert.alert('Error', 'Please fill in all shipping information');
      return;
    }

    // Validate payment information
    if (!paymentInfo.cardNumber || !paymentInfo.cardName || 
        !paymentInfo.expiryDate || !paymentInfo.cvv) {
      Alert.alert('Error', 'Please fill in all payment information');
      return;
    }

    try {
      setLoading(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear the cart
      clearCart();
      
      // Navigate to OrderSuccess screen
      navigation.navigate('OrderSuccess');
    } catch (error) {
      Alert.alert('Error', 'Failed to process your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Processing your order...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.orderSummary}>
          <Text style={styles.summaryText}>Items: {items.length}</Text>
          <Text style={styles.summaryText}>Total: ${total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Information</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={shippingInfo.fullName}
            onChangeText={(text) => setShippingInfo({ ...shippingInfo, fullName: text })}
            placeholder="Enter your full name"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={shippingInfo.email}
            onChangeText={(text) => setShippingInfo({ ...shippingInfo, email: text })}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={shippingInfo.address}
            onChangeText={(text) => setShippingInfo({ ...shippingInfo, address: text })}
            placeholder="Enter your address"
          />
        </View>
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={shippingInfo.city}
              onChangeText={(text) => setShippingInfo({ ...shippingInfo, city: text })}
              placeholder="Enter your city"
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              value={shippingInfo.state}
              onChangeText={(text) => setShippingInfo({ ...shippingInfo, state: text })}
              placeholder="Enter your state"
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>ZIP Code</Text>
            <TextInput
              style={styles.input}
              value={shippingInfo.zipCode}
              onChangeText={(text) => setShippingInfo({ ...shippingInfo, zipCode: text })}
              placeholder="Enter ZIP code"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              value={shippingInfo.country}
              onChangeText={(text) => setShippingInfo({ ...shippingInfo, country: text })}
              placeholder="Enter your country"
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={shippingInfo.phone}
            onChangeText={(text) => setShippingInfo({ ...shippingInfo, phone: text })}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={styles.input}
            value={paymentInfo.cardNumber}
            onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cardNumber: text })}
            placeholder="Enter card number"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cardholder Name</Text>
          <TextInput
            style={styles.input}
            value={paymentInfo.cardName}
            onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cardName: text })}
            placeholder="Enter cardholder name"
          />
        </View>
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              value={paymentInfo.expiryDate}
              onChangeText={(text) => setPaymentInfo({ ...paymentInfo, expiryDate: text })}
              placeholder="MM/YY"
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              value={paymentInfo.cvv}
              onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cvv: text })}
              placeholder="CVV"
              keyboardType="numeric"
              secureTextEntry
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => {
          console.log('Place Order button pressed');
          handleCheckout();
        }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.checkoutButtonText}>Place Order</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  orderSummary: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    opacity: 1,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckoutScreen; 