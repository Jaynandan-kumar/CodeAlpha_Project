// Auth Module - Handles user authentication state
const auth = {
  isLoggedIn() {
    return !!localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  setAuth(user, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  },

  logout() {
    this.clearAuth();
    showToast('Logged out successfully', 'info');
    window.location.href = '/';
  },

  // Update navbar based on auth state
  updateNavbar() {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    const user = this.getUser();
    
    // Remove existing auth links
    const existingAuth = document.getElementById('authLinks');
    if (existingAuth) existingAuth.remove();

    // Create a document fragment to hold the new auth links
    const fragment = document.createDocumentFragment();

    if (user) {
      const ordersLi = document.createElement('li');
      ordersLi.innerHTML = '<a href="orders.html">Orders</a>';
      
      const greetingLi = document.createElement('li');
      greetingLi.innerHTML = `<span class="user-greeting">Hi, ${user.name.split(' ')[0]}</span>`;
      
      const logoutLi = document.createElement('li');
      logoutLi.innerHTML = '<button class="btn btn-ghost btn-sm" onclick="auth.logout()">Logout</button>';
      
      fragment.appendChild(ordersLi);
      fragment.appendChild(greetingLi);
      fragment.appendChild(logoutLi);
    } else {
      const loginLi = document.createElement('li');
      loginLi.innerHTML = '<a href="login.html" class="btn btn-outline btn-sm">Login</a>';
      
      const signupLi = document.createElement('li');
      signupLi.innerHTML = '<a href="register.html" class="btn btn-primary btn-sm">Sign Up</a>';
      
      fragment.appendChild(loginLi);
      fragment.appendChild(signupLi);
    }

    // Wrap in a container for easy removal
    const wrapper = document.createElement('li');
    wrapper.id = 'authLinks';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '0.8rem';
    wrapper.style.listStyle = 'none';
    wrapper.appendChild(fragment);
    
    navLinks.appendChild(wrapper);
  }
};
