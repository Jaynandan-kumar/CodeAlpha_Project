import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../store';
import { formatPrice } from '../store';

interface RadialSliderProps {
  products: Product[];
}

export default function RadialSlider({ products }: RadialSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startRotation, setStartRotation] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const navigate = useNavigate();
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const itemCount = products.length;
  const anglePerItem = 360 / itemCount;
  const radius = 400;

  // Auto-rotation
  useEffect(() => {
    if (isDragging) return;

    let lastTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (Math.abs(velocity) > 0.1) {
        setRotation(prev => prev + velocity * delta * 50);
        setVelocity(prev => prev * 0.95); // Friction
      } else {
        // Slow auto-rotation
        setRotation(prev => prev + delta * 5);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isDragging, velocity]);

  // Update active index based on rotation
  useEffect(() => {
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const index = Math.round(normalizedRotation / anglePerItem) % itemCount;
    setActiveIndex(index);
  }, [rotation, anglePerItem, itemCount]);

  // Mouse/Touch handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setStartRotation(rotation);
    setVelocity(0);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startX;
    const newRotation = startRotation + deltaX * 0.5;
    setRotation(newRotation);
    
    // Calculate velocity
    const now = Date.now();
    if (lastTimeRef.current) {
      const deltaTime = (now - lastTimeRef.current) / 1000;
      if (deltaTime > 0) {
        setVelocity(deltaX * 0.5 / deltaTime / 50);
      }
    }
    lastTimeRef.current = now;
  };

  const handleEnd = () => {
    setIsDragging(false);
    lastTimeRef.current = 0;
  };

  // Wheel handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setRotation(prev => prev - e.deltaY * 0.5);
  };

  const activeProduct = products[activeIndex];

  return (
    <section className="radial-slider-section">
      <div className="section-header">
        <h2>✨ Premium Collection</h2>
        <p>Drag to explore our featured products</p>
      </div>

      <div
        ref={containerRef}
        className="radial-slider-container"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        onWheel={handleWheel}
      >
        <div className="radial-slider-track">
          {products.map((product, index) => {
            const angle = (index * anglePerItem + rotation) * (Math.PI / 180);
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            const scale = (z + radius) / (2 * radius);
            const opacity = Math.max(0.3, scale);
            const isActive = index === activeIndex;

            return (
              <div
                key={product._id}
                className={`radial-item ${isActive ? 'active' : ''}`}
                style={{
                  transform: `translateX(${x}px) translateZ(${z}px) scale(${0.6 + scale * 0.4})`,
                  opacity,
                  zIndex: isActive ? 10 : Math.floor(scale * 10),
                }}
                onClick={() => {
                  if (isActive) {
                    navigate(`/product?id=${product._id}`);
                  } else {
                    // Rotate to make this item active
                    const targetRotation = -index * anglePerItem;
                    setRotation(targetRotation);
                  }
                }}
              >
                <div className="radial-item-image">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  {product.discount && product.discount > 0 && (
                    <span className="discount-badge">-{product.discount}%</span>
                  )}
                </div>
                <div className="radial-item-info">
                  <span className="radial-brand">{product.brand}</span>
                  <h3>{product.name}</h3>
                  <div className="radial-price">
                    <span className="current-price">{formatPrice(product.price)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="original-price">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="radial-rating">
                    <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
                    <span className="rating-count">({product.numReviews})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Product Details */}
        {activeProduct && (
          <div className="radial-active-details">
            <div className="active-details-content">
              <span className="active-brand">{activeProduct.brand}</span>
              <h2>{activeProduct.name}</h2>
              <p className="active-description">{activeProduct.description}</p>
              <div className="active-price">
                <span className="current">{formatPrice(activeProduct.price)}</span>
                {activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price && (
                  <>
                    <span className="original">{formatPrice(activeProduct.originalPrice)}</span>
                    <span className="discount">Save {activeProduct.discount}%</span>
                  </>
                )}
              </div>
              <div className="active-actions">
                <button className="btn btn-primary" onClick={() => navigate(`/product?id=${activeProduct._id}`)}>
                  View Details
                </button>
                <button className="btn btn-outline">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Dots */}
      <div className="radial-dots">
        {products.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setRotation(-index * anglePerItem)}
          />
        ))}
      </div>
    </section>
  );
}
