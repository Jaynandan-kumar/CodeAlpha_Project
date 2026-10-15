// GSAP Animations Module
gsap.registerPlugin(ScrollTrigger);

const animations = {
  // Page entrance
  pageEntrance() {
    gsap.from('body', { opacity: 0, duration: 0.6 });
  },

  // Hero section animations
  heroEntrance() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const tl = gsap.timeline();
    tl.from('.hero-tag', { y: 30, opacity: 0, duration: 0.6 })
      .from('.hero h1', { y: 50, opacity: 0, duration: 0.8 }, '-=0.3')
      .from('.hero p', { y: 30, opacity: 0, duration: 0.6 }, '-=0.6')
      .from('.hero-buttons .btn', { y: 20, opacity: 0, stagger: 0.15, duration: 0.5 }, '-=0.3')
      .from('.floating-card', { scale: 0, opacity: 0, stagger: 0.2, ease: 'back.out(1.4)', duration: 0.6 }, '-=0.2');
  },

  // Floating cards infinite loop
  floatingCards() {
    const card1 = document.querySelector('.card-1');
    const card2 = document.querySelector('.card-2');
    const card3 = document.querySelector('.card-3');

    if (card1) gsap.to(card1, { y: -20, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    if (card2) gsap.to(card2, { y: 20, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    if (card3) gsap.to(card3, { y: -15, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  },

  // ScrollTrigger reveals
  scrollReveals() {
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 85%',
      onEnter: (elements) => {
        gsap.from(elements, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
        });
      },
    });
  },

  // Product cards stagger on scroll
  productCardsReveal() {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;

    ScrollTrigger.create({
      trigger: grid,
      start: 'top 80%',
      onEnter: () => {
        gsap.from('.product-card', {
          y: 60,
          opacity: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
        });
      },
    });
  },

  // 3D hover tilt on product cards
  cardTilt() {
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -6;
        const rotateY = (x - centerX) / centerX * 6;
        
        gsap.to(card, {
          rotateX,
          rotateY,
          transformPerspective: 1000,
          duration: 0.3,
          ease: 'power1.out',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
      });
    });
  },

  // Auth card entrance
  authEntrance() {
    const authCard = document.querySelector('.auth-card');
    if (!authCard) return;

    gsap.from(authCard, { y: 60, opacity: 0, duration: 0.8, ease: 'power3.out' });
    gsap.from(authCard.children, { y: 20, opacity: 0, stagger: 0.06, duration: 0.5, delay: 0.3 });
  },

  // Product detail entrance
  productDetailEntrance() {
    const img = document.querySelector('.product-detail-image');
    const info = document.querySelector('.product-detail-info');
    
    if (img) gsap.from(img, { x: -60, opacity: 0, duration: 0.8, ease: 'power3.out' });
    if (info) gsap.from(info.children, { y: 30, opacity: 0, stagger: 0.08, duration: 0.6, delay: 0.2 });
  },

  // Order cards stagger
  orderCardsEntrance() {
    gsap.from('.order-card', {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
    });
  },

  // Initialize all animations
  init() {
    this.pageEntrance();
    this.heroEntrance();
    this.floatingCards();
    this.scrollReveals();
    this.productCardsReveal();
    this.cardTilt();
    this.authEntrance();
    this.productDetailEntrance();
    this.orderCardsEntrance();
  }
};
