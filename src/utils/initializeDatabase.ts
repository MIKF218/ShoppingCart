import { ref, get, set, push, Database } from 'firebase/database';
import { db } from '../config/firebase';
import { Product } from '../types';

// Function to manually test adding a product
export const addTestProduct = async () => {
  try {
    console.log('Adding test product...');
    const productsRef = ref(db, 'products');
    const testProduct = {
      name: 'Test Product',
      price: 9.99,
      description: 'This is a test product',
      image: 'https://via.placeholder.com/150',
      category: 'Test',
      brand: 'Test Brand',
      country: 'Test Country'
    };
    
    const newProductRef = push(productsRef);
    await set(newProductRef, testProduct);
    console.log('Test product added successfully!');
    return true;
  } catch (error) {
    console.error('Error adding test product:', error);
    return false;
  }
};

const initialProducts: Omit<Product, 'id'>[] = [
  // Turkish Products
  {
    name: 'Turkish Baklava',
    price: 15.99,
    description: 'Traditional Turkish baklava with pistachio, layered phyllo pastry filled with chopped nuts and sweetened with syrup',
    image: 'https://static.ticimax.cloud/cdn-cgi/image/width=540,quality=85/38078/uploads/urunresimleri/buyuk/fistikli-karisik-baklava-xl-kutu-12a5d3.jpg',
    category: 'Sweets',
    brand: 'Hafız Mustafa',
    country: 'Turkey',
    rating: 4.5,
    reviews: []
  },
  {
    name: 'Turkish Coffee',
    price: 12.99,
    description: 'Premium Turkish coffee beans, finely ground for traditional preparation',
    image: 'https://www.mehmetefendi.com/images/content/jpg/turk-kahvesi-100g-agustos-2024-ingilizce.jpg',
    category: 'Beverages',
    brand: 'Kurukahveci Mehmet Efendi',
    country: 'Turkey',
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Turkish Delight',
    price: 9.99,
    description: 'Classic Turkish Delight with rose flavor and pistachios, dusted with powdered sugar',
    image: 'https://www.tastingtable.com/img/gallery/rose-turkish-delight-recipe/l-intro-1668790604.jpg',
    category: 'Sweets',
    brand: 'Hafız Mustafa',
    country: 'Turkey',
    rating: 4.3,
    reviews: []
  },
  {
    name: 'Turkish Tea',
    price: 7.99,
    description: 'Premium black tea from the Black Sea region of Turkey',
    image: 'https://www.grandturkishbazaar.com/wp-content/uploads/2017/12/turkish-addicted-black-tea-1000gr-35oz.jpg',
    category: 'Beverages',
    brand: 'Çaykur',
    country: 'Turkey',
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Simit',
    price: 2.99,
    description: 'Traditional circular bread covered with sesame seeds',
    image: 'https://images.deliveryhero.io/image/product-information-management/65c49753bb62642dd3239ddf.jpg?height=480',
    category: 'Bakery',
    brand: 'Simit Sarayı',
    country: 'Turkey',
    rating: 4.4,
    reviews: []
  },
  {
    name: 'Künefe',
    price: 13.99,
    description: 'Traditional dessert made with shredded phyllo dough, sweet cheese, and syrup',
    image: 'https://foodieadvice.com/storage/foods/50/medium.jpg?time=1673818159',
    category: 'Sweets',
    brand: 'Hafız Mustafa',
    country: 'Turkey',
    rating: 4.8,
    reviews: []
  },
  {
    name: 'Antep Pistachios',
    price: 16.99,
    description: 'Premium roasted pistachios from Gaziantep region',
    image: 'https://m.media-amazon.com/images/I/71ygumbVC8L._AC_UF1000,1000_QL80_.jpg',
    category: 'Nuts',
    brand: 'Malatya Pazari',
    country: 'Turkey',
    rating: 4.9,
    reviews: []
  },
  {
    name: 'Turkish Halva',
    price: 8.99,
    description: 'Traditional sesame-based halva with pistachios',
    image: 'https://www.koska.com/Files/images/Product/490x384/helvalar/40g-sade-tahin-helva.jpg',
    category: 'Sweets',
    brand: 'Koska',
    country: 'Turkey',
    rating: 4.2,
    reviews: []
  },

  // Italian Products
  {
    name: 'Italian Espresso',
    price: 14.99,
    description: 'Premium Italian espresso coffee beans, roasted to perfection',
    image: 'https://kaffekapslen.media/media/catalog/product/cache/e986fbef946fb9a322845c09204f8de5/l/a/lavazza-malet-espresso-italiano-classico-250g-01.jpg',
    category: 'Beverages',
    brand: 'Lavazza',
    country: 'Italy',
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Parmigiano Reggiano',
    price: 24.99,
    description: 'Aged Italian Parmesan cheese, 24 months maturation',
    image: 'https://vicofoodbox.com/25723-thickbox_default/parmareggio-parmigiano-reggiano-oltre-30-mesi-200-gr.jpg',
    category: 'Dairy',
    brand: 'Parmigiano Reggiano',
    country: 'Italy',
    rating: 4.9,
    reviews: []
  },

  // French Products
  {
    name: 'French Baguette',
    price: 4.99,
    description: 'Traditional French baguette, crispy crust and soft interior',
    image: 'https://cdn.prod.website-files.com/62d6dee53062554a34a0c24e/63332688d5ea92525f36d1ea_boulangerie-main.webp',
    category: 'Bakery',
    brand: 'Boulangerie',
    country: 'France',
    rating: 4.6,
    reviews: []
  },
  {
    name: 'French Macarons',
    price: 18.99,
    description: 'Assorted French macarons in various flavors',
    image: 'https://i.pinimg.com/474x/1b/8e/95/1b8e954f30558b179daefe6f377c8d26.jpg',
    category: 'Sweets',
    brand: 'Ladurée',
    country: 'France',
    rating: 4.8,
    reviews: []
  },

  // Japanese Products
  {
    name: 'Matcha Green Tea',
    price: 16.99,
    description: 'Premium Japanese matcha powder, ceremonial grade',
    image: 'https://ippodotea.com/cdn/shop/products/ippodo-tea-organic-matcha.png?v=1649205039',
    category: 'Beverages',
    brand: 'Ippodo',
    country: 'Japan',
    rating: 4.7,
    reviews: []
  },
  {
    name: 'Japanese Rice Crackers',
    price: 8.99,
    description: 'Assorted Japanese rice crackers with seaweed and soy sauce flavor',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDzY2Onod7qbnSHOT45FLWO2X9QYDbL66U-w&s',
    category: 'Snacks',
    brand: 'Kameda',
    country: 'Japan',
    rating: 4.4,
    reviews: []
  },

  // Mexican Products
  {
    name: 'Mexican Hot Chocolate',
    price: 12.99,
    description: 'Traditional Mexican hot chocolate mix with cinnamon',
    image: 'https://i5.walmartimages.com/asr/bfd690bd-73e1-4ebd-8db9-110ae60437bb.3bf23d450d564ce804fb05b7c7233dfa.jpeg',
    category: 'Beverages',
    brand: 'Abuelita',
    country: 'Mexico',
    rating: 4.5,
    reviews: []
  },
  {
    name: 'Mexican Salsa',
    price: 6.99,
    description: 'Authentic Mexican salsa verde made with tomatillos',
    image: 'https://i5.walmartimages.com/seo/HERDEZ-Salsa-Casera-Mexican-Salsa-Tortilla-Chip-Dip-Medium-16-oz-Jar_a89affc6-6310-4a4a-81d9-7809d6fb794e.442c93bbd2aa3b70da9bd08c598366a4.jpeg',
    category: 'Sauces',
    brand: 'Herdez',
    country: 'Mexico',
    rating: 4.3,
    reviews: []
  },

  // Indian Products
  {
    name: 'Indian Chai Tea',
    price: 9.99,
    description: 'Traditional Indian masala chai tea blend with spices',
    image: 'https://www.tajmahalteahouse.com/cdn/shop/files/61H5n4O4bmL._SX679.jpg?v=1696341635Indian%20Basmati%20Rice',
    category: 'Beverages',
    brand: 'Taj Mahal',
    country: 'India',
    rating: 4.6,
    reviews: []
  },
  {
    name: 'Indian Basmati Rice',
    price: 11.99,
    description: 'Premium Indian basmati rice, aged for superior flavor',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMz3L_9qQZYRGsCmOedwetpqDFfmSmQQyAHw&s',
    category: 'Grains',
    brand: 'Tilda',
    country: 'India',
    rating: 4.7,
    reviews: []
  }
];

export const testDatabaseConnection = async () => {
  try {
    console.log('Testing database connection...');
    
    // First, try to read from the database
    const testRef = ref(db, 'test');
    await get(testRef);
    console.log('Successfully read from database');
    
    // Then, try to write to the database
    const testData = { timestamp: Date.now() };
    await set(testRef, testData);
    console.log('Successfully wrote to database');
    
    // Clean up test data
    await set(testRef, null);
    console.log('Successfully cleaned up test data');
    
    return true;
  } catch (error) {
    console.error('Database connection test failed with error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return false;
  }
};

export const checkDatabaseProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = ref(db, 'products');
    const snapshot = await get(productsRef);
    console.log('Checking products in database...');
    if (snapshot.exists()) {
      const products: Product[] = [];
      snapshot.forEach((childSnapshot) => {
        const productId = childSnapshot.key;
        if (productId) {
          products.push({
            id: productId,
            ...childSnapshot.val()
          });
        }
      });
      console.log(`Found ${products.length} products in database`);
      return products;
    }
    console.log('No products found in database');
    return [];
  } catch (error) {
    console.error('Error checking products:', error);
    throw error;
  }
};

export const resetDatabase = async () => {
  try {
    console.log('Resetting database...');
    
    // Remove all existing products
    const productsRef = ref(db, 'products');
    await set(productsRef, null);
    console.log('Cleared existing products');
    
    // Add new products
    for (const product of initialProducts) {
      const newProductRef = push(productsRef);
      await set(newProductRef, product);
      console.log(`Added product: ${product.name}`);
    }
    
    console.log('Database reset completed successfully!');
    return true;
  } catch (error) {
    console.error('Error resetting database:', error);
    return false;
  }
};

export const initializeDatabase = async () => {
  try {
    console.log('Starting database initialization...');
    
    // First test the connection
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }

    // Then check if products already exist
    const existingProducts = await checkDatabaseProducts();
    console.log('Checking existing products...');

    if (existingProducts.length === 0) {
      console.log('No products found, initializing with default products...');
      // Only add products if the database is empty
      const productsRef = ref(db, 'products');
      for (const product of initialProducts) {
        const newProductRef = push(productsRef);
        await set(newProductRef, product);
        console.log(`Added product: ${product.name}`);
      }
      console.log('Database initialization completed successfully!');
    } else {
      console.log(`Found ${existingProducts.length} existing products, skipping initialization`);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}; 