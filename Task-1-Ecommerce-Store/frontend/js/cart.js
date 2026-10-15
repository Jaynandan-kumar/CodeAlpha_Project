// Cart Module - Handles cart operations
const cart = {
  async getCount() {
    if (!auth.isLoggedIn()) return 0;
    const { data, ok } = await api.getCart();
    if (!ok) return 0;
    return data.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  async updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    
    const count = await this.getCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
    
    if (count > 0) {
      gsap.fromTo(badge, { scale: 0 }, { scale: 1.4, duration: 0.4, yoyo: true, repeat: 1 });
    }
  },

  async addToCart(productId, quantity = 1) {
    if (!auth.isLoggedIn()) {
      showToast('Please login to add items to cart', 'error');
      window.location.href = '/login.html';
      return;
    }

    const { data, ok } = await api.addToCart(productId, quantity);
    if (ok) {
      await this.updateBadge();
      showToast('Added to cart!', 'success');
    } else {
      showToast(data.message || 'Failed to add to cart', 'error');
    }
  },

  async removeItem(productId) {
    const { data, ok } = await api.removeFromCart(productId);
    if (ok) {
      await this.updateBadge();
      showToast('Item removed', 'info');
      return data;
    }
    return null;
  },

  async updateQuantity(productId, quantity) {
    const { data, ok } = await api.updateCart(productId, quantity);
    if (ok) {
      await this.updateBadge();
      return data;
    }
    return null;
  }
};

// Toast notification helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <span class="toast-message">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Format price in INR
function formatPrice(price) {
  return '₹' + price.toLocaleString('en-IN');
}
