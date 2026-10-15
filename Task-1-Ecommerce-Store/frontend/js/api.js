// API Helper - Handles all backend communication
const API_BASE = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json();

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/login.html';
    }

    return { data, status: response.status, ok: response.ok };
  } catch (error) {
    console.error('API Error:', error);
    return { data: { message: error.message }, status: 500, ok: false };
  }
}

// API Methods
const api = {
  // Auth
  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', body: { name, email, password } }),
  
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
  
  getMe: () => request('/auth/me'),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products?${query}`);
  },
  
  getProduct: (id) => request(`/products/${id}`),

  // Cart
  getCart: () => request('/cart'),
  
  addToCart: (productId, quantity = 1) =>
    request('/cart/add', { method: 'POST', body: { productId, quantity } }),
  
  updateCart: (productId, quantity) =>
    request('/cart/update', { method: 'PUT', body: { productId, quantity } }),
  
  removeFromCart: (productId) =>
    request(`/cart/remove/${productId}`, { method: 'DELETE' }),

  // Orders
  placeOrder: (shippingAddress, paymentMethod) =>
    request('/orders', { method: 'POST', body: { shippingAddress, paymentMethod } }),
  
  getMyOrders: () => request('/orders/my'),
  
  getOrder: (id) => request(`/orders/${id}`),
};
