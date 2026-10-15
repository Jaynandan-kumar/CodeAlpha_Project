import { useState, useEffect, useCallback, createContext, useContext, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { productsAPI, authAPI, cartAPI, ordersAPI, wishlistAPI, formatPrice, getShipping, User, Product, CartItem, Order } from './store';
import { EmptyCartSVG, SuccessSVG, LoadingSVG, NoResultsSVG } from './components/SVGIllustrations';
import { useAnime } from './hooks/useAnime';
import SmoothScroll from './components/SmoothScroll';
import PremiumHeader from './components/PremiumHeader';
import RadialSlider from './components/RadialSlider';

// Lazy load heavy components
const ThreeHero = lazy(() => import('./components/ThreeHero'));
const MatterBadges = lazy(() => import('./components/MatterBadges'));

// ===== CONTEXT =====
interface AppContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (productId: string, quantity?: number) => void;
  updateCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  wishlistCount: number;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// ===== TOAST COMPONENT =====
function Toast({ message, type, onClose, id }: { message: string; type: string; onClose: () => void; id: number }) {
  const { slideInRight } = useAnime();
  const toastRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.setAttribute('data-toast-id', id.toString());
      slideInRight(`[data-toast-id="${id}"]`);
    }
  }, [slideInRight, id]);

  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons: Record<string, string> = { success: '✅', error: '❌', info: 'ℹ️' };

  return (
    <div className={`toast ${type}`} ref={toastRef}>
      <span className="toast-icon">{icons[type] || 'ℹ️'}</span>
      <span className="toast-message">{message}</span>
    </div>
  );
}

// ===== SKELETON LOADER =====
function SkeletonCard() {
  return (
    <div className="product-card skeleton-card">
      <div className="skeleton-image skeleton-pulse" />
      <div className="product-card-info">
        <div className="skeleton-line skeleton-pulse" style={{ width: '40%' }} />
        <div className="skeleton-line skeleton-pulse" style={{ width: '80%', height: 16 }} />
        <div className="skeleton-line skeleton-pulse" style={{ width: '50%' }} />
        <div className="skeleton-line skeleton-pulse" style={{ width: '60%', height: 20 }} />
      </div>
    </div>
  );
}

// ===== NAVBAR =====
// Navbar is now handled by AmazonHeader component

// ===== FOOTER =====
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h4>ShopVerse</h4>
          <p>Your one-stop destination for premium products. Quality guaranteed with fast delivery across India.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/orders">Orders</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/products?category=Electronics">Electronics</Link></li>
            <li><Link to="/products?category=Laptops">Laptops</Link></li>
            <li><Link to="/products?category=Audio">Audio</Link></li>
            <li><Link to="/products?category=Fashion">Fashion</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="#">support@shopverse.in</a></li>
            <li><a href="#">+91 98765 43210</a></li>
            <li><a href="#">Mumbai, India</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2027 ShopVerse. Built for CodeAlpha Full Stack Development Internship. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ===== HOME PAGE =====
function HomePage() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);

  useEffect(() => {
    const allProducts = productsAPI.getAll();
    setFeaturedProducts(productsAPI.getAll({ featured: true }).slice(0, 8));
    setBestSellers(productsAPI.getAll({ sort: 'popular' }).slice(0, 4));
    setNewArrivals(productsAPI.getAll({ sort: 'newest' }).slice(0, 4));
  }, []);

  return (
    <div className="page-enter">
      {/* Hero Section with Three.js */}
      <section className="hero">
        <Suspense fallback={null}>
          <ThreeHero />
        </Suspense>
        <div className="hero-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content">
            <span className="hero-tag">🚀 New Arrivals 2024</span>
            <h1>Discover <span>Premium</span> Products</h1>
            <p>Shop the latest tech, fashion, and lifestyle products with free shipping on orders above ₹5,000. Quality guaranteed.</p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>
                Shop Now →
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/register')}>
                Join Free
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-blob"></div>
            <div className="floating-card" style={{ animation: 'float1 3s ease-in-out infinite' }}>
              <img src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop" alt="" />
              <div className="fc-info">
                <h4>iPhone 15 Pro</h4>
                <p>₹1,29,999</p>
              </div>
            </div>
            <div className="floating-card" style={{ animation: 'float2 3.5s ease-in-out infinite' }}>
              <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100&h=100&fit=crop" alt="" />
              <div className="fc-info">
                <h4>Sony XM5</h4>
                <p>₹29,999</p>
              </div>
            </div>
            <div className="floating-card" style={{ animation: 'float3 2.8s ease-in-out infinite' }}>
              <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop" alt="" />
              <div className="fc-info">
                <h4>MacBook Air</h4>
                <p>₹1,14,999</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matter.js Physics Badges Section */}
      <section className="section matter-section">
        <div className="section-header">
          <h2>Interactive Showcase</h2>
          <p>Drag the product badges — powered by Matter.js physics</p>
        </div>
        <Suspense fallback={<div className="spinner" />}>
          <MatterBadges />
        </Suspense>
      </section>

      {/* Radial Product Slider */}
      {featuredProducts.length > 0 && (
        <RadialSlider products={featuredProducts} />
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>✨ Featured Products</h2>
            <p>Handpicked premium products just for you</p>
          </div>
          <div className="products-grid">
            {featuredProducts.slice(0, 8).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      <section className="section">
        <div className="section-header">
          <h2>🔥 Best Sellers</h2>
          <p>Most popular products among our customers</p>
        </div>
        <div className="products-grid">
          {bestSellers.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section">
        <div className="section-header">
          <h2>🆕 New Arrivals</h2>
          <p>Latest additions to our collection</p>
        </div>
        <div className="products-grid">
          {newArrivals.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>
            View All Products →
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: 'white', borderRadius: 'var(--radius)', margin: '0 2rem', padding: '3rem 2rem' }}>
        <div className="section-header">
          <h2>Why Shop With Us?</h2>
          <p>We provide the best shopping experience</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚚</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Free Shipping</h3>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Free delivery on orders above ₹5,000</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔒</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Secure Payment</h3>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Multiple payment options with encryption</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>↩️</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Easy Returns</h3>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>7-day hassle-free return policy</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>24/7 Support</h3>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Round the clock customer assistance</p>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(20px); } }
        @keyframes float3 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
      `}</style>
    </div>
  );
}

// ===== PRODUCT CARD =====
function ProductCard({ product }: { product: Product }) {
  const { addToCart, user, showToast, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      showToast('Please login to add items to cart', 'error');
      navigate('/login');
      return;
    }
    addToCart(product._id);
    showToast(`${product.name} added to cart!`, 'success');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      showToast('Please login to add items to wishlist', 'error');
      navigate('/login');
      return;
    }
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      showToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product._id);
      showToast('Added to wishlist!', 'success');
    }
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let stars = '★'.repeat(full);
    if (half) stars += '½';
    return stars;
  };

  const isWishlisted = user ? isInWishlist(product._id) : false;

  return (
    <div className="product-card" onClick={() => navigate(`/product?id=${product._id}`)}>
      <div className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="product-badge">{product.category}</span>
        {product.discount && product.discount > 0 && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} 
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWishlisted ? '❤️' : '♡'}
        </button>
      </div>
      <div className="product-card-info">
        <span className="product-card-brand">{product.brand}</span>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-rating">
          <span className="stars">{renderStars(product.rating)}</span>
          <span className="rating-num">({product.rating}) · {product.numReviews} reviews</span>
        </div>
        <div className="product-card-pricing">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="product-card-original-price">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <div className="product-card-stock">
          {product.stock > 10 ? (
            <span className="stock-in-stock">✓ In Stock</span>
          ) : product.stock > 0 ? (
            <span className="stock-low">Only {product.stock} left!</span>
          ) : (
            <span className="stock-out">Out of Stock</span>
          )}
        </div>
        <div className="product-card-actions">
          <button className="btn btn-primary btn-sm" onClick={handleAddToCart} disabled={product.stock === 0}>
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== PRODUCTS PAGE =====
function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [priceRange, setPriceRange] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const categories = ['All', ...productsAPI.getCategories()];

  // Debounced search - waits 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchInput);
      setSearchParams({ keyword: searchInput, category, sort });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sync state when URL changes externally (e.g., footer category links)
  useEffect(() => {
    const urlKeyword = searchParams.get('keyword') || '';
    const urlCategory = searchParams.get('category') || 'All';
    const urlSort = searchParams.get('sort') || 'newest';
    
    if (urlKeyword !== keyword) {
      setKeyword(urlKeyword);
      setSearchInput(urlKeyword);
    }
    if (urlCategory !== category) setCategory(urlCategory);
    if (urlSort !== sort) setSort(urlSort);
  }, [searchParams]);

  useEffect(() => {
    let minPrice: number | undefined;
    let maxPrice: number | undefined;
    
    switch (priceRange) {
      case 'under5000': maxPrice = 5000; break;
      case '5000to20000': minPrice = 5000; maxPrice = 20000; break;
      case '20000to50000': minPrice = 20000; maxPrice = 50000; break;
      case '50000to100000': minPrice = 50000; maxPrice = 100000; break;
      case 'above100000': minPrice = 100000; break;
    }

    const filtered = productsAPI.getAll({ keyword, category, sort, minPrice, maxPrice, minRating });
    setProducts(filtered);
  }, [keyword, category, sort, priceRange, minRating]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setSearchParams({ keyword, category: value, sort });
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setSearchParams({ keyword, category, sort: value });
  };

  return (
    <div className="section page-enter">
      <div className="section-header">
        <h2>All Products</h2>
        <p>Browse our collection of premium products</p>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select className="filter-select" value={sort} onChange={(e) => handleSortChange(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="popular">Most Popular</option>
          <option value="discount">Biggest Discount</option>
        </select>
        <button className="btn btn-outline btn-sm" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {showFilters && (
        <div className="advanced-filters">
          <div className="filter-group">
            <label>Price Range:</label>
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
              <option value="all">All Prices</option>
              <option value="under5000">Under ₹5,000</option>
              <option value="5000to20000">₹5,000 - ₹20,000</option>
              <option value="20000to50000">₹20,000 - ₹50,000</option>
              <option value="50000to100000">₹50,000 - ₹1,00,000</option>
              <option value="above100000">Above ₹1,00,000</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Minimum Rating:</label>
            <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
              <option value={0}>All Ratings</option>
              <option value={4}>4★ & above</option>
              <option value={4.5}>4.5★ & above</option>
            </select>
          </div>
        </div>
      )}

      <div className="products-count">
        Showing {products.length} {products.length === 1 ? 'product' : 'products'}
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <NoResultsSVG />
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

// ===== PRODUCT DETAIL PAGE =====
function ProductDetailPage() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id') || '';
  const [product, setProduct] = useState<Product | null>(() => productsAPI.getById(productId));
  const [quantity, setQuantity] = useState(1);
  const { addToCart, user, showToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const p = productsAPI.getById(productId);
    setProduct(p);
    setQuantity(1); // Reset quantity when product changes
  }, [productId]);

  if (!product) {
    return (
      <div className="section">
        <div className="empty-state">
          <div className="emoji">😕</div>
          <h3>Product not found</h3>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>Back to Products</button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      showToast('Please login to add items to cart', 'error');
      navigate('/login');
      return;
    }
    addToCart(product._id, quantity);
    showToast(`${product.name} added to cart!`, 'success');
  };

  const stockClass = product.stock > 10 ? 'in-stock' : 'low-stock';
  const stockText = product.stock > 10 ? `In Stock (${product.stock} available)` : `Only ${product.stock} left!`;

  return (
    <div className="product-detail page-enter">
      <div className="product-detail-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-detail-info">
        <div className="breadcrumb">
          <Link to="/products">Products</Link> / <span>{product.category}</span>
        </div>
        <h1>{product.name}</h1>
        <div className="product-detail-meta">
          <span className="brand">{product.brand}</span>
          <span className="category-badge">{product.category}</span>
          <span className="stars" style={{ color: '#f1c40f' }}>
            {'★'.repeat(Math.floor(product.rating))} {product.rating}
          </span>
        </div>
        <div className="product-detail-price">{formatPrice(product.price)}</div>
        <p className="product-detail-description">{product.description}</p>
        <div className={`stock-status ${stockClass}`}>
          <span>{product.stock > 10 ? '✓' : '⚠️'}</span>
          <span>{stockText}</span>
        </div>
        <div className="quantity-selector">
          <label>Quantity:</label>
          <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={product.stock === 0}>−</button>
          <span className="qty-value">{quantity}</span>
          <button className="qty-btn" onClick={() => setQuantity(Math.max(1, Math.min(product.stock, quantity + 1)))} disabled={product.stock === 0}>+</button>
        </div>
        <div className="detail-actions">
          <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
            🛒 Add to Cart
          </button>
          <button className="btn btn-outline btn-lg" onClick={() => navigate('/products')}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== CART PAGE =====
function CartPage() {
  const { user, cartItems, updateCart, removeFromCart } = useApp();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="cart-page page-enter">
        <div className="empty-state">
          <div className="emoji">🔐</div>
          <h3>Please login to view your cart</h3>
          <p>You need to be logged in to manage your shopping cart</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Login Now</button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page page-enter">
        <h1>Shopping Cart</h1>
        <div className="empty-state">
          <EmptyCartSVG />
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>Shop Now</button>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = getShipping(subtotal);
  const total = subtotal + shipping;

  return (
    <div className="cart-page page-enter">
      <h1>Shopping Cart ({cartItems.length} items)</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.product} className="cart-item">
              <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <span className="brand">{item.brand}</span>
                <div className="price">{formatPrice(item.price)}</div>
              </div>
              <div className="cart-item-actions">
                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => updateCart(item.product, item.quantity - 1)}>−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateCart(item.product, item.quantity + 1)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.product)}>🗑️ Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className={shipping === 0 ? 'free-shipping' : ''}>
              {shipping === 0 ? 'FREE' : formatPrice(shipping)}
            </span>
          </div>
          {shipping > 0 && (
            <p style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '0.5rem' }}>
              Add {formatPrice(5000 - subtotal)} more for free shipping!
            </p>
          )}
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/checkout')}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== CHECKOUT PAGE =====
function CheckoutPage() {
  const { user, cartItems, showToast } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'COD'
  });
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect to login if not authenticated (must use useEffect, not render-time navigate)
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Render nothing while redirecting
  }

  // Order success state
  if (orderSuccess) {
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
    
    return (
      <div className="checkout-page page-enter">
        <div className="order-success-card">
          <SuccessSVG />
          <h2>Order Placed Successfully! 🎉</h2>
          <p className="success-subtitle">Thank you for your purchase</p>
          
          <div className="success-details">
            <div className="success-row">
              <span className="success-label">Order ID</span>
              <span className="success-value">#{orderSuccess._id.slice(-10).toUpperCase()}</span>
            </div>
            <div className="success-row">
              <span className="success-label">Total Amount</span>
              <span className="success-value">{formatPrice(orderSuccess.totalPrice)}</span>
            </div>
            <div className="success-row">
              <span className="success-label">Payment Method</span>
              <span className="success-value">{orderSuccess.paymentMethod}</span>
            </div>
            <div className="success-row">
              <span className="success-label">Order Date</span>
              <span className="success-value">{new Date(orderSuccess.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="success-row">
              <span className="success-label">Estimated Delivery</span>
              <span className="success-value">{estimatedDelivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="success-row">
              <span className="success-label">Shipping To</span>
              <span className="success-value">{orderSuccess.shippingAddress.city}, {orderSuccess.shippingAddress.country}</span>
            </div>
          </div>

          <div className="success-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/orders')}>
              View Orders
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page page-enter">
        <div className="empty-state">
          <EmptyCartSVG />
          <h3>Your cart is empty</h3>
          <p>Add some items before checking out</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>Shop Now</button>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = getShipping(subtotal);
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay for better UX
    setTimeout(() => {
      try {
        const order = ordersAPI.placeOrder(user._id, {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        }, formData.paymentMethod);

        setOrderSuccess(order);
        showToast('Order placed successfully! 🎉', 'success');
      } catch (err) {
        showToast('Failed to place order', 'error');
        setIsSubmitting(false);
      }
    }, 800);
  };

  return (
    <div className="checkout-page page-enter">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Shipping Address</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Full Name *</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
            </div>
            <div className="form-group">
              <label>Postal Code *</label>
              <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="400001" required />
            </div>
            <div className="form-group full-width">
              <label>Address *</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123, Street Name, Area" required />
            </div>
            <div className="form-group">
              <label>City *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Mumbai" required />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} />
            </div>
            <div className="form-group full-width">
              <label>Payment Method *</label>
              <div className="payment-methods">
                <label className={`payment-option ${formData.paymentMethod === 'COD' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === 'COD'} onChange={handleChange} />
                  <div className="payment-card">
                    <div className="payment-icon">💵</div>
                    <div className="payment-info">
                      <strong>Cash on Delivery</strong>
                      <span>Pay when you receive</span>
                    </div>
                  </div>
                </label>
                <label className={`payment-option ${formData.paymentMethod === 'UPI' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="UPI" checked={formData.paymentMethod === 'UPI'} onChange={handleChange} />
                  <div className="payment-card">
                    <div className="payment-icon">📱</div>
                    <div className="payment-info">
                      <strong>UPI</strong>
                      <span>Pay using any UPI app</span>
                    </div>
                  </div>
                </label>
                <label className={`payment-option ${formData.paymentMethod === 'GPAY' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="GPAY" checked={formData.paymentMethod === 'GPAY'} onChange={handleChange} />
                  <div className="payment-card">
                    <div className="payment-icon">🟢</div>
                    <div className="payment-info">
                      <strong>Google Pay</strong>
                      <span>Fast & secure UPI payment</span>
                    </div>
                  </div>
                </label>
                <label className={`payment-option ${formData.paymentMethod === 'PHONEPE' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="PHONEPE" checked={formData.paymentMethod === 'PHONEPE'} onChange={handleChange} />
                  <div className="payment-card">
                    <div className="payment-icon">🟣</div>
                    <div className="payment-info">
                      <strong>PhonePe</strong>
                      <span>Pay using PhonePe UPI</span>
                    </div>
                  </div>
                </label>
                <label className={`payment-option ${formData.paymentMethod === 'PAYTM' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="PAYTM" checked={formData.paymentMethod === 'PAYTM'} onChange={handleChange} />
                  <div className="payment-card">
                    <div className="payment-icon">🔵</div>
                    <div className="payment-info">
                      <strong>Paytm</strong>
                      <span>Pay using Paytm wallet/UPI</span>
                    </div>
                  </div>
                </label>
                <label className={`payment-option ${formData.paymentMethod === 'CARD' ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value="CARD" checked={formData.paymentMethod === 'CARD'} onChange={handleChange} />
                  <div className="payment-card">
                    <div className="payment-icon">💳</div>
                    <div className="payment-info">
                      <strong>Credit/Debit Card</strong>
                      <span>Visa, Mastercard, RuPay</span>
                    </div>
                  </div>
                </label>
              </div>
              <p className="payment-disclaimer">🔒 This is a demo payment — no real transaction will be processed</p>
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary btn-lg btn-block" 
            style={{ marginTop: '1.5rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="btn-spinner"></span>
                Processing...
              </>
            ) : (
              `Place Order — ${formatPrice(total)}`
            )}
          </button>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray)', textAlign: 'center', marginTop: '0.5rem' }}>
            🔒 This is a demo payment — no real charges
          </p>
        </form>
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.map(item => (
            <div key={item.product} className="summary-row" style={{ fontSize: '0.85rem' }}>
              <span>{item.name} × {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="summary-row" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--light)' }}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className={shipping === 0 ? 'free-shipping' : ''}>
              {shipping === 0 ? 'FREE' : formatPrice(shipping)}
            </span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== ORDERS PAGE =====
function OrdersPage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      setOrders(ordersAPI.getMyOrders(user._id));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="orders-page page-enter">
        <div className="empty-state">
          <div className="emoji">🔐</div>
          <h3>Please login to view your orders</h3>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Login Now</button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page page-enter">
        <h1>My Orders</h1>
        <div className="empty-state">
          <div className="emoji">📦</div>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>Shop Now</button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page page-enter">
      <h1>My Orders ({orders.length})</h1>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-card-header">
              <span className="order-id">#{order._id.slice(-10).toUpperCase()}</span>
              <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
            </div>
            <div className="order-items-list">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="order-item-row">
                  <img src={item.image} alt={item.name} />
                  <span>{item.name} × {item.quantity}</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              Total: {formatPrice(order.totalPrice)} | {order.paymentMethod}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== LOGIN PAGE =====
function LoginPage() {
  const { login, showToast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        showToast('Welcome back! 🎉', 'success');
        navigate('/');
      } else {
        showToast(result.error || 'Login failed', 'error');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-bg-circle"></div>
      <div className="auth-bg-circle"></div>
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to your ShopVerse account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={isLoading}>
            {isLoading ? <><span className="btn-spinner"></span> Logging in...</> : 'Login'}
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

// ===== REGISTER PAGE =====
function RegisterPage() {
  const { register, showToast } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const result = register(name, email, password);
      if (result.success) {
        showToast('Account created successfully! 🎉', 'success');
        navigate('/');
      } else {
        showToast(result.error || 'Registration failed', 'error');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-bg-circle"></div>
      <div className="auth-bg-circle"></div>
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join ShopVerse today</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password (min 6 characters)</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
                minLength={6} 
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={isLoading}>
            {isLoading ? <><span className="btn-spinner"></span> Creating account...</> : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

// ===== MAIN APP =====
function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: string }[]>([]);
  
  // Initialize auth state
  useEffect(() => {
    const auth = authAPI.getCurrentUser();
    if (auth) {
      setUser(auth.user);
      setToken(auth.token);
    }
  }, []);

  // Update cart and wishlist when user changes
  useEffect(() => {
    if (user) {
      const cart = cartAPI.getCart(user._id);
      setCartItems(cart.items);
      const wishlist = wishlistAPI.getWishlist(user._id);
      setWishlistItems(wishlist.items);
    } else {
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [user]);
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const login = (email: string, password: string) => {
    const result = authAPI.login(email, password);
    if ('error' in result) return { success: false, error: result.error };
    
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem('token', result.token);
    localStorage.setItem('currentUser', JSON.stringify(result.user));
    return { success: true };
  };

  const register = (name: string, email: string, password: string) => {
    const result = authAPI.register(name, email, password);
    if ('error' in result) return { success: false, error: result.error };
    
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem('token', result.token);
    localStorage.setItem('currentUser', JSON.stringify(result.user));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCartItems([]);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    showToast('Logged out successfully', 'info');
  };

  const addToCart = (productId: string, quantity: number = 1) => {
    if (!user) return;
    const cart = cartAPI.addItem(user._id, productId, quantity);
    setCartItems([...cart.items]);
  };

  const updateCart = (productId: string, quantity: number) => {
    if (!user) return;
    const cart = cartAPI.updateItem(user._id, productId, quantity);
    setCartItems([...cart.items]);
  };

  const removeFromCart = (productId: string) => {
    if (!user) return;
    const cart = cartAPI.removeItem(user._id, productId);
    setCartItems([...cart.items]);
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    if (!user) return;
    cartAPI.clearCart(user._id);
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist functions
  const addToWishlist = (productId: string) => {
    if (!user) return;
    wishlistAPI.addToWishlist(user._id, productId);
    setWishlistItems([...wishlistAPI.getWishlist(user._id).items]);
    showToast('Added to wishlist', 'success');
  };

  const removeFromWishlist = (productId: string) => {
    if (!user) return;
    wishlistAPI.removeFromWishlist(user._id, productId);
    setWishlistItems([...wishlistAPI.getWishlist(user._id).items]);
    showToast('Removed from wishlist', 'info');
  };

  const isInWishlist = (productId: string) => {
    if (!user) return false;
    return wishlistAPI.isInWishlist(user._id, productId);
  };

  const wishlistCount = wishlistItems.length;

  const contextValue: AppContextType = {
    user,
    token,
    login,
    register,
    logout,
    cartItems,
    cartCount,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    showToast,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };

  return (
    <AppContext.Provider value={contextValue}>
      <SmoothScroll>
        <div className="fade-in">
          <PremiumHeader />
          <main style={{ minHeight: '70vh' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        
        {/* Toast Container */}
        <div className="toast-container">
          {toasts.map(toast => (
            <Toast key={toast.id} id={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
          ))}
        </div>
        </div>
      </SmoothScroll>
    </AppContext.Provider>
  );
}

// ===== WISHLIST PAGE =====
function WishlistPage() {
  const { user, wishlistCount, removeFromWishlist, addToCart, showToast } = useApp();
  const navigate = useNavigate();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (user) {
      setWishlistProducts(wishlistAPI.getWishlistProducts(user._id));
    }
  }, [user, wishlistCount]);

  if (!user) {
    return (
      <div className="section page-enter">
        <div className="empty-state">
          <div className="emoji">🔐</div>
          <h3>Please login to view your wishlist</h3>
          <p>You need to be logged in to manage your wishlist</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Login Now</button>
        </div>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="section page-enter">
        <h1>My Wishlist</h1>
        <div className="empty-state">
          <div className="emoji">❤️</div>
          <h3>Your wishlist is empty</h3>
          <p>Save your favorite products to buy them later</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>Browse Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="section page-enter">
      <h1>My Wishlist ({wishlistProducts.length} items)</h1>
      <div className="products-grid">
        {wishlistProducts.map(product => (
          <div key={product._id}>
            <ProductCard product={product} />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', padding: '0 1rem 1rem' }}>
              <button 
                className="btn btn-primary btn-sm" 
                style={{ flex: 1 }}
                onClick={() => {
                  addToCart(product._id);
                  showToast(`${product.name} added to cart!`, 'success');
                }}
              >
                Add to Cart
              </button>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => {
                  removeFromWishlist(product._id);
                  showToast('Removed from wishlist', 'info');
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== 404 PAGE =====
function NotFoundPage() {
  const navigate = useNavigate();
  
  return (
    <div className="section page-enter">
      <div className="empty-state">
        <svg viewBox="0 0 200 200" className="svg-illustration" aria-label="Page not found">
          <defs>
            <linearGradient id="notFoundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e17055" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6c5ce7" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="url(#notFoundGrad)" />
          <text x="100" y="90" textAnchor="middle" fontSize="48" fontWeight="bold" fill="#6c5ce7">404</text>
          <text x="100" y="120" textAnchor="middle" fontSize="14" fill="#636e72">Page Not Found</text>
        </svg>
        <h3>Oops! Page not found</h3>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
          <button className="btn btn-outline" onClick={() => navigate('/products')}>Browse Products</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
