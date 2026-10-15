# 🛒 ShopVerse — Premium Fashion & Lifestyle E-commerce Platform

> A Myntra-inspired, enterprise-grade e-commerce marketplace built as part of the **CodeAlpha Full Stack Development Internship** (Task 1). Features 103+ products, 3D animations, physics interactions, wishlist functionality, and premium UI/UX inspired by Myntra, Amazon, and Awwwards-winning websites.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://gsap.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📋 Overview

ShopVerse is a premium fashion and lifestyle e-commerce platform featuring 103+ products across 20+ categories, Myntra-inspired UI/UX, user authentication, shopping cart management, wishlist functionality, order processing, and stunning visual effects including 3D animations, physics simulations, and micro-interactions.

## ✨ Features

### Core Features
- 🔐 **User Authentication** — Register/Login with JWT tokens & bcrypt hashing
- 🛍️ **103 Products** — Across 20+ categories with discounts, ratings, and stock indicators
- 👗 **Fashion Collection** — 25 fashion products (Men, Women, Kids, Footwear, Beauty, Accessories, Home)
- ❤️ **Wishlist** — Save favorite products with persistent storage
- 🔍 **Advanced Search & Filters** — Keyword search, category, price range, rating, sort options
- 📄 **Product Details** — Full product page with quantity selector, size selection, and stock status
- 🛒 **Shopping Cart** — Persistent cart with quantity controls, stock validation & order summary
- 📦 **Order Processing** — Complete checkout with shipping form & multiple payment methods
- 💳 **6 Payment Methods** — COD, UPI, Google Pay, PhonePe, Paytm, Credit/Debit Card (Demo)
- 📋 **Order History** — View all past orders with status tracking
- 🎉 **Order Success** — Animated success screen with order details

### Visual & Animation Features
- 🌐 **Three.js 3D Hero** — Floating geometric shapes with mouse interaction
- ⚡ **Matter.js Physics** — Interactive draggable product badges
- 🎬 **GSAP Animations** — Scroll-triggered reveals, page transitions
- ✨ **Anime.js Micro-interactions** — Toast animations, badge pops, counters
- 🎨 **SVG Animations** — Custom illustrations for empty states & success
- 💫 **Skeleton Loading** — Polished loading states for products
- 🌊 **Smooth Transitions** — Page enter animations, hover effects

### UX Features
- 📱 **Fully Responsive** — Desktop, tablet, and mobile layouts
- 👁️ **Password Toggle** — Show/hide password in auth forms
- 🔔 **Toast Notifications** — Real-time feedback for user actions
- ♿ **Accessibility** — Reduced motion support, focus states, ARIA labels
- ⚡ **Performance** — Code-splitting, lazy loading, proper cleanup

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Vanilla CSS with Custom Properties |
| **3D Graphics** | Three.js (lazy-loaded, code-split) |
| **Physics** | Matter.js (code-split, mobile fallback) |
| **Animations** | GSAP 3.12 + ScrollTrigger |
| **Micro-interactions** | Anime.js v4 |
| **Routing** | React Router v6 (HashRouter) |
| **Backend** | Node.js, Express.js (MVC) |
| **Database** | MongoDB + Mongoose ODM |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Utilities** | cors, dotenv, morgan, express-validator |

## 📁 Architecture

```
CodeAlpha_EcommerceStore/
│
├── src/                          # React Frontend (Build)
│   ├── components/
│   │   ├── ThreeHero.tsx         # Three.js 3D hero (lazy-loaded)
│   │   ├── MatterBadges.tsx      # Matter.js physics section
│   │   └── SVGIllustrations.tsx  # SVG animations & illustrations
│   ├── hooks/
│   │   └── useAnime.ts           # Anime.js micro-interactions
│   ├── App.tsx                   # Main application
│   ├── store.ts                  # Data store (localStorage simulation)
│   ├── index.css                 # Complete styling
│   └── main.tsx                  # Entry point
│
├── backend/                      # Express.js API
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, GetMe
│   │   ├── productController.js  # CRUD products
│   │   ├── cartController.js     # Cart operations
│   │   └── orderController.js    # Order processing
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema
│   │   ├── Cart.js               # Cart schema
│   │   └── Order.js              # Order schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── seed/
│   │   └── seedProducts.js       # 12 product seeder
│   ├── .env
│   ├── .env.example
│   ├── server.js                 # Entry point
│   └── package.json
│
├── frontend/                     # Vanilla JS Frontend (Alternative)
│   ├── css/style.css
│   ├── js/
│   │   ├── api.js                # API helper
│   │   ├── auth.js               # Auth logic
│   │   ├── cart.js               # Cart logic
│   │   ├── animations.js         # GSAP animations
│   │   └── main.js               # App initialization
│   └── index.html
│
├── DEMO_SCRIPT.md                # Video demo script
├── INTERVIEW_QA.md               # 40 interview Q&A
├── README.md                     # This file
├── LICENSE
├── .gitignore
└── screenshots/
```

## 🚀 Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### Frontend Setup
```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run seed     # Seed 12 products
npm run dev      # Start at http://localhost:5000
```

## 💳 Payment Methods

ShopVerse supports multiple payment options (all simulated for demo purposes):

| Method | Description |
|--------|-------------|
| 💵 **Cash on Delivery** | Pay when you receive your order |
| 📱 **UPI** | Pay using any UPI app |
| 🟢 **Google Pay** | Fast & secure UPI payment |
| 🟣 **PhonePe** | Pay using PhonePe UPI |
| 🔵 **Paytm** | Pay using Paytm wallet/UPI |
| 💳 **Credit/Debit Card** | Visa, Mastercard, RuPay |

> **⚠️ Important:** Payment processing is **simulated for demonstration purposes**. No real financial transaction is performed. Card numbers, CVV, and banking credentials are **never stored or logged**.

## 🔐 Security

- Passwords hashed with **bcrypt** (10 salt rounds)
- **JWT tokens** with 7-day expiry
- Protected routes via **middleware**
- **CORS** configured
- Environment variables for secrets
- Price snapshots in cart/orders (backend-calculated)
- Ownership checks on order access
- Input validation on all endpoints
- No passwords returned by APIs
- No payment credentials stored

## 🎬 Animation Architecture

| Library | Purpose | Loading |
|---------|---------|---------|
| **Three.js** | 3D hero background | Lazy-loaded, code-split |
| **Matter.js** | Physics badges section | Code-split, mobile fallback |
| **GSAP** | Scroll animations, page transitions | CDN |
| **Anime.js** | Micro-interactions (toasts, badges) | Bundled |
| **SVG** | Empty states, success screens | Inline |
| **CSS** | Hover effects, transitions | Inline |

### Performance
- Three.js pauses when hero not visible (IntersectionObserver)
- Matter.js disabled on mobile (< 768px)
- All animations respect `prefers-reduced-motion`
- Proper cleanup of geometries, materials, event listeners
- `requestAnimationFrame` for smooth rendering

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| GET | `/me` | Get current user | ✅ |

### Products (`/api/products`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List products (filters) | ❌ |
| GET | `/:id` | Single product | ❌ |
| POST | `/` | Create product | ✅ Admin |

### Cart (`/api/cart`) — All Protected
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get user's cart |
| POST | `/add` | Add item to cart |
| PUT | `/update` | Update quantity |
| DELETE | `/remove/:id` | Remove item |

### Orders (`/api/orders`) — All Protected
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Place order |
| GET | `/my` | User's orders |
| GET | `/:id` | Single order |

## 🧪 Testing Checklist

- [ ] Register new account
- [ ] Login with credentials
- [ ] Browse products
- [ ] Search by name
- [ ] Filter by category
- [ ] Sort by price/rating
- [ ] View product detail
- [ ] Add to cart (requires login)
- [ ] Adjust quantity
- [ ] Remove from cart
- [ ] Checkout with shipping
- [ ] Place order (success animation)
- [ ] View order history
- [ ] Logout
- [ ] Mobile responsive (320px-1440px)
- [ ] Reduced motion preference
- [ ] Three.js fallback (no WebGL)
- [ ] Matter.js mobile fallback

## 📸 Screenshots

> Add screenshots to the `screenshots/` folder

| Home Page | Products |
|-----------|----------|
| ![Home](screenshots/home.png) | ![Products](screenshots/products.png) |

| 3D Hero | Physics Badges |
|---------|---------------|
| ![3D](screenshots/threejs.png) | ![Physics](screenshots/matterjs.png) |

| Cart | Order Success |
|------|--------------|
| ![Cart](screenshots/cart.png) | ![Success](screenshots/success.png) |

## 🗺️ Roadmap

- [ ] Admin dashboard
- [ ] Payment gateway (Razorpay/Stripe)
- [ ] Product reviews system
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Image upload (Multer + Cloudinary)
- [ ] Rate limiting
- [ ] Docker containerization
- [ ] CI/CD pipeline

## 👨‍💻 Author

**CodeAlpha Full Stack Development Intern**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/)

## 🙏 Acknowledgements

- [CodeAlpha](https://codealpha.tech/) — Internship opportunity
- [Three.js](https://threejs.org/) — 3D graphics
- [Matter.js](https://brm.io/matter-js/) — Physics engine
- [GSAP](https://gsap.com/) — Animation library
- [Anime.js](https://animejs.com/) — Micro-interactions
- [MongoDB](https://www.mongodb.com/) — Database
- [Unsplash](https://unsplash.com/) — Product images

---

**Built with ❤️ as part of CodeAlpha Full Stack Development Internship — Task 1**
