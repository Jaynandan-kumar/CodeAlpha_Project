import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import { useApp } from '../App';

export default function MyntraHeader() {
  const { user, cartCount, logout, wishlistCount } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { name: 'Men', link: '/products?gender=Men' },
    { name: 'Women', link: '/products?gender=Women' },
    { name: 'Kids', link: '/products?category=Kids' },
    { name: 'Beauty', link: '/products?category=Beauty' },
    { name: 'Footwear', link: '/products?category=Footwear' },
    { name: 'Accessories', link: '/products?category=Accessories' },
    { name: 'Home', link: '/products?category=Home' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div className="myntra-top-banner">
        <p>✨ FLAT 50% OFF on 1 Lakh+ Styles | Use Code: <strong>MYNTRA50</strong></p>
      </div>

      {/* Main Header */}
      <header className="myntra-header">
        <div className="myntra-header-container">
          {/* Logo */}
          <Link to="/" className="myntra-logo">
            <span className="logo-text">ShopVerse</span>
          </Link>

          {/* Navigation */}
          <nav className="myntra-nav">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.link}
                className={`myntra-nav-link ${activeCategory === cat.name ? 'active' : ''}`}
                onMouseEnter={() => setActiveCategory(cat.name)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="myntra-actions">
            {/* Search */}
            <form onSubmit={handleSearch} className="myntra-search">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for products, brands and more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Profile */}
            <div className="myntra-action-item">
              <FiUser />
              <span className="action-label">
                {user ? user.name.split(' ')[0] : 'Profile'}
              </span>
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="myntra-action-item">
              <FiHeart />
              <span className="action-label">Wishlist</span>
              {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            </Link>

            {/* Bag */}
            <Link to="/cart" className="myntra-action-item">
              <FiShoppingBag />
              <span className="action-label">Bag</span>
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="myntra-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="myntra-mobile-menu">
            <nav className="mobile-nav">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>Orders</Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
