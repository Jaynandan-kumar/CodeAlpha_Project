import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiUser, FiHeart, FiMenu, FiX } from 'react-icons/fi';
import { useApp } from '../App';

export default function PremiumHeader() {
  const { user, cartCount, wishlistCount, logout } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className={`premium-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="premium-header-container">
          {/* Brand */}
          <Link to="/" className="premium-brand">
            <span className="brand-mark">SV</span>
            <span className="brand-name">ShopVerse</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="premium-nav">
            <Link to="/products?category=Electronics" className="nav-link">Electronics</Link>
            <Link to="/products?category=Fashion" className="nav-link">Fashion</Link>
            <Link to="/products?category=Home" className="nav-link">Home</Link>
            <Link to="/products?category=Beauty" className="nav-link">Beauty</Link>
            <Link to="/products?sort=newest" className="nav-link">New</Link>
          </nav>

          {/* Actions */}
          <div className="premium-actions">
            {/* Search */}
            <form onSubmit={handleSearch} className="premium-search">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
            </form>

            {/* User */}
            {user ? (
              <div className="user-menu">
                <button className="icon-btn" aria-label="User menu">
                  <FiUser />
                </button>
                <div className="user-dropdown">
                  <span className="user-name">Hi, {user.name.split(' ')[0]}</span>
                  <Link to="/orders">Orders</Link>
                  <Link to="/wishlist">Wishlist</Link>
                  <button onClick={logout}>Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="icon-btn" aria-label="Login">
                <FiUser />
              </Link>
            )}

            {/* Wishlist */}
            <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
              <FiHeart />
              {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="icon-btn cart-icon" aria-label="Cart">
              <FiShoppingBag />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="brand-mark">SV</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <FiX />
              </button>
            </div>
            <nav className="mobile-nav">
              <Link to="/products?category=Electronics" onClick={() => setIsMobileMenuOpen(false)}>Electronics</Link>
              <Link to="/products?category=Fashion" onClick={() => setIsMobileMenuOpen(false)}>Fashion</Link>
              <Link to="/products?category=Home" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/products?category=Beauty" onClick={() => setIsMobileMenuOpen(false)}>Beauty</Link>
              <Link to="/products?sort=newest" onClick={() => setIsMobileMenuOpen(false)}>New Arrivals</Link>
              <hr />
              {user ? (
                <>
                  <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
                  <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>Wishlist</Link>
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
        </div>
      )}
    </>
  );
}
