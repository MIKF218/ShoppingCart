import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Product, CartItem, Review } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { HomeStackParamList, TabParamList } from '../types/navigation';
import { api } from '../services/api';

type ProductDetailScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'ProductDetail'>,
  BottomTabNavigationProp<TabParamList>
>;

type ProductDetailScreenRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;

const ProductDetailScreen = () => {
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { authState } = useAuth();
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState(product);

  useEffect(() => {
    const initializeProduct = async () => {
      try {
        // Initialize product fields if needed
        await api.initializeProductFields();
        
        // Then fetch the updated product
        const updatedProduct = await api.getProductById(product.id);
        setProductData(updatedProduct);
      } catch (error) {
        console.error('Error initializing product:', error);
      }
    };

    initializeProduct();
  }, [product.id]);

  const handleAddToCart = () => {
    try {
      if (quantity < 1) {
        Alert.alert('Error', 'Please select a valid quantity');
        return;
      }
      
      // Add the product with the selected quantity
      addToCart(product, quantity);
      
      Alert.alert('Success', `${quantity} item(s) added to cart!`, [
        {
          text: 'Continue Shopping',
          style: 'cancel',
        },
        {
          text: 'View Cart',
          onPress: () => {
            navigation.getParent()?.navigate('Cart');
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add items to cart');
    }
  };

  const handleQuantityChange = (value: number) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityInput = (text: string) => {
    const newQuantity = parseInt(text);
    if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    } else if (text === '') {
      setQuantity(1);
    }
  };

  const handleAddReview = async () => {
    if (!authState.user) {
      Alert.alert('Error', 'Please login to add a review');
      return;
    }

    if (newRating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!newReview.trim()) {
      Alert.alert('Error', 'Please enter a review comment');
      return;
    }

    try {
      setIsSubmitting(true);

      const review: Review = {
        id: Date.now().toString(),
        userId: authState.user.id,
        userName: authState.user.name,
        rating: newRating,
        comment: newReview.trim(),
        createdAt: new Date().toISOString()
      };

      // Add the review to the database
      await api.addReview(productData.id, review);

      // Get the updated product data
      const updatedProduct = await api.getProductById(productData.id);
      
      // Update the UI with the new data
      setProductData(updatedProduct);
      
      setNewReview('');
      setNewRating(0);
      Alert.alert('Success', 'Review added successfully');
    } catch (error: any) {
      console.error('Error in handleAddReview:', error);
      Alert.alert('Error', error.message || 'Failed to add review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={24}
          color={i <= rating ? "#FFD700" : "#ccc"}
          style={styles.star}
        />
      );
    }
    return stars;
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewerName}>{item.userName}</Text>
        <View style={styles.reviewRating}>
          {renderRatingStars(item.rating)}
        </View>
      </View>
      <Text style={styles.reviewDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {productData.image ? (
          <Image
            source={{ uri: productData.image }}
            style={styles.productImage}
            resizeMode="contain"
            onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
          />
        ) : (
          <View style={[styles.productImage, styles.placeholderImage]}>
            <Ionicons name="image-outline" size={48} color="#ccc" />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.productName}>{productData.name}</Text>
        <Text style={styles.productPrice}>${productData.price.toFixed(2)}</Text>
        <View style={styles.ratingContainer}>
          {renderRatingStars(productData.rating || 0)}
          <Text style={styles.ratingText}>({productData.rating?.toFixed(1) || '0.0'})</Text>
        </View>
        <Text style={styles.productBrand}>{productData.brand}</Text>
        <Text style={styles.productCountry}>Made in {productData.country}</Text>
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.productDescription}>{productData.description}</Text>
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(-1)}
            >
              <Ionicons name="remove" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              value={quantity.toString()}
              onChangeText={handleQuantityInput}
              keyboardType="numeric"
              maxLength={2}
            />
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(1)}
            >
              <Ionicons name="add" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Add to Cart ({quantity})</Text>
        </TouchableOpacity>

        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          
          {authState.user && (
            <View style={styles.addReviewContainer}>
              <Text style={styles.addReviewTitle}>Add a Review</Text>
              <View style={styles.ratingInput}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setNewRating(star)}
                  >
                    <Ionicons
                      name={star <= newRating ? "star" : "star-outline"}
                      size={24}
                      color={star <= newRating ? "#FFD700" : "#ccc"}
                      style={styles.star}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.reviewInput}
                placeholder="Write your review..."
                value={newReview}
                onChangeText={setNewReview}
                multiline
                numberOfLines={4}
              />
              <TouchableOpacity
                style={[styles.submitReviewButton, isSubmitting && styles.submitReviewButtonDisabled]}
                onPress={handleAddReview}
                disabled={isSubmitting}
              >
                <Text style={styles.submitReviewText}>
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {productData.reviews && productData.reviews.length > 0 ? (
            <FlatList
              data={productData.reviews}
              renderItem={renderReviewItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noReviewsText}>No reviews yet. Be the first to review!</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  productPrice: {
    fontSize: 22,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  productBrand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  productCountry: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  descriptionContainer: {
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  quantityContainer: {
    marginBottom: 24,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityInput: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
    padding: 4,
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  star: {
    marginRight: 4,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  reviewsSection: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    marginTop: 16,
  },
  addReviewContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  addReviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  ratingInput: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitReviewButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitReviewButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitReviewText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  noReviewsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 16,
  },
});

export default ProductDetailScreen; 