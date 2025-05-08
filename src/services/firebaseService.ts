import { db } from '../config/firebase';
import { Product } from '../types';

export const firebaseService = {
  // Product operations
  async getAllProducts(): Promise<Product[]> {
    try {
      const snapshot = await db.ref('products').once('value');
      const products: Product[] = [];
      
      snapshot.forEach((childSnapshot) => {
        products.push({
          id: childSnapshot.key || '',
          ...childSnapshot.val()
        });
      });
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      const snapshot = await db.ref(`products/${id}`).once('value');
      if (!snapshot.exists()) {
        throw new Error('Product not found');
      }
      return {
        id: snapshot.key || '',
        ...snapshot.val()
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    try {
      const newProductRef = db.ref('products').push();
      await newProductRef.set(product);
      return newProductRef.key || '';
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    try {
      await db.ref(`products/${id}`).update(updates);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await db.ref(`products/${id}`).remove();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Orders operations
  async createOrder(userId: string, orderData: any): Promise<string> {
    try {
      const newOrderRef = db.ref(`orders/${userId}`).push();
      await newOrderRef.set({
        ...orderData,
        createdAt: db.ServerValue.TIMESTAMP
      });
      return newOrderRef.key || '';
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getOrderHistory(userId: string): Promise<any[]> {
    try {
      const snapshot = await db.ref(`orders/${userId}`).once('value');
      const orders: any[] = [];
      
      snapshot.forEach((childSnapshot) => {
        orders.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Real-time product updates
  onProductsChange(callback: (products: Product[]) => void) {
    db.ref('products').on('value', (snapshot) => {
      const products: Product[] = [];
      snapshot.forEach((childSnapshot) => {
        products.push({
          id: childSnapshot.key || '',
          ...childSnapshot.val()
        });
      });
      callback(products);
    });
  },

  // Cleanup
  detachListeners() {
    db.ref('products').off();
  }
}; 