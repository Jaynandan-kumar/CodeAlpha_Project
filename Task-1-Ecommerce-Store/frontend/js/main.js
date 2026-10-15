// Main Application Script
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize auth state
  auth.updateNavbar();
  
  // Update cart badge
  await cart.updateBadge();

  // Initialize animations
  animations.init();

  // Load featured products on home page
  if (document.getElementById('featuredGrid')) {
    await loadFeaturedProducts();
  }
});

// Load featured products
async function loadFeaturedProducts() {
  const { data, ok } = await api.getProducts({ sort: 'rating' });
  if (!ok) return;

  const grid = document.getElementById('featuredGrid');
  const featured = data.slice(0, 4);

  grid.innerHTML = featured.map(product => createProductCard(product)).join('');
  
  // Re-initialize card tilt for new elements
  animations.cardTilt();
}

// Create product card HTML
function createProductCard(product) {
  const stars = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '½' : '');
  
  return `
    <div class="product-card" onclick="window.location.href='product.html?id=${product._id}'">
      <div class="product-card-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-badge">${product.category}</span>
        <button class="wishlist-btn" onclick="event.stopPropagation(); showToast('Added to wishlist!', 'info');">♡</button>
      </div>
      <div class="product-card-info">
        <span class="product-card-brand">${product.brand}</span>
        <h3 class="product-card-name">${product.name}</h3>
        <div class="product-card-rating">
          <span class="stars">${stars}</span>
          <span class="rating-num">(${product.rating})</span>
        </div>
        <div class="product-card-price">${formatPrice(product.price)}</div>
        <div class="product-card-actions">
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); cart.addToCart('${product._id}')">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}
