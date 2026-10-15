import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiMapPin, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { useApp } from '../App';

export default function AmazonHeader() {
  const { user, cartCount, wishlistCount, logout } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Generate suggestions based on input
    if (value.length > 2) {
      const suggestions = [
        'iPhone 15 Pro',
        'Samsung Galaxy S24',
        'MacBook Air M3',
        'Sony WH-1000XM5',
        'Nike Air Max',
        'Apple Watch Series 9',
      ].filter(item => item.toLowerCase().includes(value.toLowerCase()));
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  };

  const categories = [
    { name: 'Electronics', icon: '📱', items: ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Headphones'] },
    { name: 'Fashion', icon: '👕', items: ['Men', 'Women', 'Kids', 'Shoes', 'Accessories'] },
    { name: 'Home & Kitchen', icon: '🏠', items: ['Furniture', 'Appliances', 'Cookware', 'Decor', 'Lighting'] },
    { name: 'Beauty', icon: '💄', items: ['Skincare', 'Makeup', 'Haircare', 'Fragrances', 'Tools'] },
    { name: 'Sports', icon: '⚽', items: ['Fitness', 'Outdoor', 'Cycling', 'Swimming', 'Yoga'] },
    { name: 'Books', icon: '📚', items: ['Fiction', 'Non-Fiction', 'Academic', 'Comics', 'Stationery'] },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="header-top-bar">
        <div className="header-container">
          <div className="top-bar-left">
            <Link to="/" className="logo-link">
              <span className="logo-text">ShopVerse</span>
            </Link>
            <div className="deliver-to">
              <FiMapPin size={16} />
              <div className="deliver-info">
                <span className="deliver-label">Deliver to</span>
                <span className="deliver-location">Mumbai 400001</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="header-search">
            <select className="search-category">
              <option>All</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home</option>
              <option>Beauty</option>
            </select>
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search products, brands and more"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {searchSuggestions.length > 0 && (
                <div className="search-suggestions">
                  {searchSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="suggestion-item"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setSearchSuggestions([]);
                        navigate(`/products?keyword=${encodeURIComponent(suggestion)}`);
                      }}
                    >
                      <FiSearch size={14} />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="search-btn">
              <FiSearch size={20} />
            </button>
          </form>

          {/* Right Actions */}
          <div className="header-actions">
            {user ? (
              <div className="user-dropdown">
                <button className="action-btn">
                  <FiUser size={20} />
                  <span>Hello, {user.name.split(' ')[0]}</span>
                  <FiChevronDown size={14} />
                </button>
                <div className="dropdown-menu">
                  <Link to="/orders">My Orders</Link>
                  <Link to="/wishlist">
                    Wishlist {wishlistCount > 0 && <span className="badge" style={{ marginLeft: '0.5rem', background: 'var(--danger)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '10px', fontSize: '0.7rem' }}>{wishlistCount}</span>}
                  </Link>
                  <Link to="/account">My Account</Link>
                  <button onClick={logout}>Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="action-btn">
                <FiUser size={20} />
                <span>Sign In</span>
              </Link>
            )}

            <Link to="/orders" className="action-btn">
              <span>Returns</span>
              <span className="action-bold">& Orders</span>
            </Link>

            <Link to="/cart" className="cart-btn">
              <div className="cart-icon-wrapper">
                <FiShoppingCart size={24} />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </div>
              <span>Cart</span>
            </Link>

            <button
              className="mobile-menu-btn"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className={`header-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="nav-links">
            <button
              className="nav-link all-categories"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <FiMenu size={18} />
              <span>All Categories</span>
              <FiChevronDown size={14} />
            </button>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products?sort=discount" className="nav-link">Today's Deals</Link>
            <Link to="/products?sort=popular" className="nav-link">Best Sellers</Link>
            <Link to="/products?sort=newest" className="nav-link">New Arrivals</Link>
            <Link to="/products?category=Electronics" className="nav-link">Electronics</Link>
            <Link to="/products?category=Fashion" className="nav-link">Fashion</Link>
            <Link to="/products?category=Home" className="nav-link">Home & Kitchen</Link>
            <Link to="/products?category=Beauty" className="nav-link">Beauty</Link>
            <Link to="/customer-service" className="nav-link">Customer Service</Link>
          </div>
        </div>

        {/* Mega Menu */}
        {showMegaMenu && (
          <div
            className="mega-menu"
            onMouseEnter={() => setShowMegaMenu(true)}
            onMouseLeave={() => setShowMegaMenu(false)}
          >
            <div className="mega-menu-container">
              {categories.map((category, idx) => (
                <div key={idx} className="mega-menu-column">
                  <h3>
                    <span className="mega-icon">{category.icon}</span>
                    {category.name}
                  </h3>
                  <ul>
                    {category.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <Link to={`/products?category=${category.name}`}>{item}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h2>ShopVerse</h2>
              <button onClick={() => setShowMobileMenu(false)}>
                <FiX size={24} />
              </button>
            </div>
            <div className="mobile-menu-content">
              {user && (
                <div className="mobile-user-info">
                  <FiUser size={32} />
                  <div>
                    <p>Hello, {user.name}</p>
                    <button onClick={logout}>Logout</button>
                  </div>
                </div>
              )}
              <nav className="mobile-nav">
                <Link to="/" onClick={() => setShowMobileMenu(false)}>Home</Link>
                <Link to="/products" onClick={() => setShowMobileMenu(false)}>All Products</Link>
                <Link to="/products?sort=discount" onClick={() => setShowMobileMenu(false)}>Today's Deals</Link>
                <Link to="/products?sort=popular" onClick={() => setShowMobileMenu(false)}>Best Sellers</Link>
                <Link to="/products?sort=newest" onClick={() => setShowMobileMenu(false)}>New Arrivals</Link>
                <Link to="/cart" onClick={() => setShowMobileMenu(false)}>Cart ({cartCount})</Link>
                <Link to="/orders" onClick={() => setShowMobileMenu(false)}>My Orders</Link>
                {user ? (
                  <button onClick={() => { logout(); setShowMobileMenu(false); }}>Logout</button>
                ) : (
                  <Link to="/login" onClick={() => setShowMobileMenu(false)}>Sign In</Link>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
