const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

let mongoServer;
let authToken;
let userId;
let testProductId;

// ===== SETUP & TEARDOWN =====
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  
  // Set JWT_SECRET for tests
  process.env.JWT_SECRET = 'test_secret_key_for_testing_only';
  process.env.NODE_ENV = 'test';
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all collections
  await User.deleteMany({});
  await Product.deleteMany({});
  await Cart.deleteMany({});
  await Order.deleteMany({});
});

// ===== HELPER FUNCTIONS =====
const registerUser = async (name = 'Test User', email = 'test@example.com', password = 'password123') => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name, email, password });
  return res;
};

const loginUser = async (email = 'test@example.com', password = 'password123') => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  return res;
};

const createTestProduct = async (overrides = {}) => {
  const productData = {
    name: 'Test Product',
    description: 'Test description',
    price: 1000,
    category: 'Electronics',
    brand: 'TestBrand',
    stock: 10,
    ...overrides,
  };
  const product = await Product.create(productData);
  return product;
};

// ===== AUTHENTICATION TESTS =====
describe('Authentication', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await registerUser();
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('token');
      expect(res.body.name).toBe('Test User');
      expect(res.body.email).toBe('test@example.com');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should reject duplicate email registration', async () => {
      await registerUser();
      const res = await registerUser();
      
      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/already registered/i);
    });

    it('should reject registration with short password', async () => {
      const res = await registerUser('Test', 'test@example.com', '12345');
      
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/at least 6 characters/i);
    });

    it('should reject registration with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test' });
      
      expect(res.status).toBe(400);
    });

    it('should reject registration with invalid email', async () => {
      const res = await registerUser('Test', 'invalid-email', 'password123');
      
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      await registerUser();
      const res = await loginUser();
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe('test@example.com');
    });

    it('should reject login with wrong password', async () => {
      await registerUser();
      const res = await loginUser('test@example.com', 'wrongpassword');
      
      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid/i);
    });

    it('should reject login with non-existent email', async () => {
      const res = await loginUser('nonexistent@example.com');
      
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const registerRes = await registerUser();
      authToken = registerRes.body.token;
      
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.email).toBe('test@example.com');
    });

    it('should reject request without token', async () => {
      const res = await request(app).get('/api/auth/me');
      
      expect(res.status).toBe(401);
    });

    it('should reject request with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token');
      
      expect(res.status).toBe(401);
    });
  });
});

// ===== PRODUCTS TESTS =====
describe('Products', () => {
  beforeEach(async () => {
    await createTestProduct({ name: 'iPhone 15', price: 100000, stock: 5 });
    await createTestProduct({ name: 'Samsung S24', price: 80000, category: 'Electronics', stock: 10 });
    await createTestProduct({ name: 'Sony Headphones', price: 25000, category: 'Audio', stock: 15 });
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const res = await request(app).get('/api/products');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
    });

    it('should filter products by keyword', async () => {
      const res = await request(app).get('/api/products?keyword=iPhone');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('iPhone 15');
    });

    it('should filter products by category', async () => {
      const res = await request(app).get('/api/products?category=Audio');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should sort products by price (low to high)', async () => {
      const res = await request(app).get('/api/products?sort=price_low');
      
      expect(res.status).toBe(200);
      expect(res.body[0].price).toBeLessThanOrEqual(res.body[1].price);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product', async () => {
      const product = await Product.findOne({ name: 'iPhone 15' });
      const res = await request(app).get(`/api/products/${product._id}`);
      
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('iPhone 15');
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/products/${fakeId}`);
      
      expect(res.status).toBe(404);
    });

    it('should return 400 for invalid product ID', async () => {
      const res = await request(app).get('/api/products/invalid-id');
      
      expect(res.status).toBe(400);
    });
  });
});

// ===== CART TESTS =====
describe('Cart', () => {
  let product;

  beforeEach(async () => {
    const registerRes = await registerUser();
    authToken = registerRes.body.token;
    userId = registerRes.body._id;
    product = await createTestProduct({ stock: 5 });
    testProductId = product._id.toString();
  });

  describe('POST /api/cart/add', () => {
    it('should add item to cart', async () => {
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: testProductId, quantity: 2 });
      
      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].quantity).toBe(2);
    });

    it('should reject adding out-of-stock product', async () => {
      const outOfStockProduct = await createTestProduct({ name: 'Out of Stock', stock: 0 });
      
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: outOfStockProduct._id.toString(), quantity: 1 });
      
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/out of stock/i);
    });

    it('should reject quantity exceeding stock', async () => {
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: testProductId, quantity: 10 }); // stock is 5
      
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/only \d+ items available/i);
    });

    it('should reject invalid quantity', async () => {
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: testProductId, quantity: -1 });
      
      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/cart/add')
        .send({ productId: testProductId, quantity: 1 });
      
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/cart/update', () => {
    it('should update cart item quantity', async () => {
      // First add item
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: testProductId, quantity: 1 });
      
      // Then update
      const res = await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: testProductId, quantity: 3 });
      
      expect(res.status).toBe(200);
      expect(res.body.items[0].quantity).toBe(3);
    });
  });

  describe('DELETE /api/cart/remove/:productId', () => {
    it('should remove item from cart', async () => {
      // Add item first
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: testProductId, quantity: 1 });
      
      // Remove it
      const res = await request(app)
        .delete(`/api/cart/remove/${testProductId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(0);
    });
  });
});

// ===== ORDERS TESTS =====
describe('Orders', () => {
  let product;

  beforeEach(async () => {
    const registerRes = await registerUser();
    authToken = registerRes.body.token;
    userId = registerRes.body._id;
    product = await createTestProduct({ price: 5000, stock: 10 });
    testProductId = product._id.toString();

    // Add item to cart
    await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ productId: testProductId, quantity: 2 });
  });

  describe('POST /api/orders', () => {
    it('should create order successfully', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          shippingAddress: {
            fullName: 'John Doe',
            address: '123 Test St',
            city: 'Mumbai',
            postalCode: '400001',
            country: 'India',
            phone: '+919876543210',
          },
          paymentMethod: 'COD',
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.totalPrice).toBe(10199); // 5000*2 + 199 shipping
      expect(res.body.status).toBe('Pending');
    });

    it('should decrease product stock after order', async () => {
      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          shippingAddress: {
            fullName: 'John Doe',
            address: '123 Test St',
            city: 'Mumbai',
            postalCode: '400001',
            country: 'India',
            phone: '+919876543210',
          },
          paymentMethod: 'COD',
        });
      
      const updatedProduct = await Product.findById(testProductId);
      expect(updatedProduct.stock).toBe(8); // 10 - 2
    });

    it('should clear cart after order', async () => {
      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          shippingAddress: {
            fullName: 'John Doe',
            address: '123 Test St',
            city: 'Mumbai',
            postalCode: '400001',
            country: 'India',
            phone: '+919876543210',
          },
          paymentMethod: 'COD',
        });
      
      const cart = await Cart.findOne({ user: userId });
      expect(cart.items).toHaveLength(0);
    });

    it('should reject order with insufficient stock', async () => {
      // Try to order more than available
      await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: testProductId, quantity: 15 }); // stock is 10
      
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          shippingAddress: {
            fullName: 'John Doe',
            address: '123 Test St',
            city: 'Mumbai',
            postalCode: '400001',
            country: 'India',
            phone: '+919876543210',
          },
          paymentMethod: 'COD',
        });
      
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/insufficient stock/i);
    });

    it('should reject order with missing shipping address', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ paymentMethod: 'COD' });
      
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/orders/my', () => {
    it('should return user orders', async () => {
      // Create an order first
      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          shippingAddress: {
            fullName: 'John Doe',
            address: '123 Test St',
            city: 'Mumbai',
            postalCode: '400001',
            country: 'India',
            phone: '+919876543210',
          },
          paymentMethod: 'COD',
        });
      
      const res = await request(app)
        .get('/api/orders/my')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return own order', async () => {
      const orderRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          shippingAddress: {
            fullName: 'John Doe',
            address: '123 Test St',
            city: 'Mumbai',
            postalCode: '400001',
            country: 'India',
            phone: '+919876543210',
          },
          paymentMethod: 'COD',
        });
      
      const res = await request(app)
        .get(`/api/orders/${orderRes.body._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
    });

    it('should reject access to another user order', async () => {
      const orderRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          shippingAddress: {
            fullName: 'John Doe',
            address: '123 Test St',
            city: 'Mumbai',
            postalCode: '400001',
            country: 'India',
            phone: '+919876543210',
          },
          paymentMethod: 'COD',
        });
      
      // Create another user
      const otherUserRes = await registerUser('Other User', 'other@example.com', 'password123');
      
      // Try to access order with other user's token
      const res = await request(app)
        .get(`/api/orders/${orderRes.body._id}`)
        .set('Authorization', `Bearer ${otherUserRes.body.token}`);
      
      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/not authorized/i);
    });
  });
});
