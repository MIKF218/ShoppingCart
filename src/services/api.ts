import { ref, get, set, push, update, child } from 'firebase/database';
import { db } from '../config/firebase';
import { Product, Review } from '../types';

class ApiService {
  async getProducts(): Promise<Product[]> {
    try {
      const productsRef = ref(db, 'products');
      const snapshot = await get(productsRef);
      
      if (snapshot.exists()) {
        const products: Product[] = [];
        snapshot.forEach((childSnapshot) => {
          const productId = childSnapshot.key;
          if (productId) {
            const productData = childSnapshot.val();
            // Ensure rating and reviews are properly initialized
            products.push({
              id: productId,
              ...productData,
              rating: typeof productData.rating === 'number' ? productData.rating : 0,
              reviews: Array.isArray(productData.reviews) ? productData.reviews : []
            });
          }
        });
        return products;
      }
      return [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async initializeProductFields(): Promise<void> {
    try {
      const productsRef = ref(db, 'products');
      const snapshot = await get(productsRef);
      
      if (snapshot.exists()) {
        const updates: { [key: string]: any } = {};
        
        snapshot.forEach((childSnapshot) => {
          const productId = childSnapshot.key;
          const productData = childSnapshot.val();
          
          if (productId) {
            // Only update if fields are missing
            if (typeof productData.rating !== 'number' || !Array.isArray(productData.reviews)) {
              updates[`${productId}/rating`] = productData.rating || 0;
              updates[`${productId}/reviews`] = productData.reviews || [];
            }
          }
        });

        // Apply updates if there are any
        if (Object.keys(updates).length > 0) {
          await update(ref(db, 'products'), updates);
          console.log('Products updated with rating and reviews fields');
        }
      }
    } catch (error) {
      console.error('Error initializing product fields:', error);
      throw error;
    }
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    try {
      const productsRef = ref(db, 'products');
      const newProductRef = push(productsRef);
      const productId = newProductRef.key;
      if (!productId) {
        throw new Error('Failed to generate product ID');
      }

      // Always include rating and reviews fields
      const productWithDefaults = {
        ...product,
        rating: 0,
        reviews: []
      };

      await set(newProductRef, productWithDefaults);
      return productId;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  async addReview(productId: string, review: Review): Promise<void> {
    try {
      const productRef = ref(db, `products/${productId}`);
      const snapshot = await get(productRef);
      
      if (!snapshot.exists()) {
        throw new Error('Product not found');
      }

      const product = snapshot.val();
      const currentReviews = Array.isArray(product.reviews) ? product.reviews : [];
      
      // Add the new review
      const updatedReviews = [...currentReviews, review];

      // Calculate new average rating
      const totalRating = updatedReviews.reduce((sum: number, r: Review) => sum + r.rating, 0);
      const averageRating = totalRating / updatedReviews.length;

      // Update the product with new review and rating
      await update(productRef, {
        reviews: updatedReviews,
        rating: parseFloat(averageRating.toFixed(1))
      });
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    try {
      const productRef = ref(db, `products/${productId}`);
      const snapshot = await get(productRef);
      
      if (!snapshot.exists()) {
        return [];
      }

      const product = snapshot.val();
      return Array.isArray(product.reviews) ? product.reviews : [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  async getProductById(productId: string): Promise<Product> {
    try {
      const productRef = ref(db, `products/${productId}`);
      const snapshot = await get(productRef);
      
      if (!snapshot.exists()) {
        throw new Error('Product not found');
      }

      const productData = snapshot.val();
      
      // Ensure rating and reviews are properly initialized
      const product = {
        id: productId,
        ...productData,
        rating: typeof productData.rating === 'number' ? productData.rating : 0,
        reviews: Array.isArray(productData.reviews) ? productData.reviews : []
      };

      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }
}

export const api = new ApiService(); 