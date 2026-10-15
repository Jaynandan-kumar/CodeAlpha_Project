// Data Store - Simulates MongoDB backend using localStorage
// This mirrors the Express/Mongoose backend structure

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  brand: string;
  stock: number;
  rating: number;
  numReviews: number;
  featured?: boolean;
  gender?: 'Men' | 'Women' | 'Kids' | 'Unisex';
  color?: string;
  sizes?: string[];
  fabric?: string;
  fit?: string;
  occasion?: string;
  createdAt: string;
}

export interface CartItem {
  product: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  brand: string;
}

export interface Cart {
  user: string;
  items: CartItem[];
}

export interface Wishlist {
  user: string;
  items: string[]; // Product IDs
}

export interface Order {
  _id: string;
  user: string;
  orderItems: { name: string; quantity: number; price: number; product: string; image: string }[];
  shippingAddress: { fullName: string; address: string; city: string; postalCode: string; country: string; phone: string };
  paymentMethod: string;
  totalPrice: number;
  status: string;
  isPaid: boolean;
  createdAt: string;
}

// Seed Products - 32 products across multiple categories
const seedProducts: Product[] = [
  // ===== SMARTPHONES =====
  {
    _id: 'p1',
    name: 'Apple iPhone 15 Pro',
    description: 'The iPhone 15 Pro features a titanium design, A17 Pro chip, and an advanced camera system with 48MP main sensor. Experience the most powerful iPhone ever with USB-C connectivity and Action button.',
    price: 129999,
    originalPrice: 134999,
    discount: 4,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop',
    category: 'Smartphones',
    brand: 'Apple',
    stock: 25,
    rating: 4.8,
    numReviews: 234,
    featured: true,
    createdAt: '2024-01-15T00:00:00Z'
  },
  // ===== MORE SMARTPHONES =====
  {
    _id: 'p2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy S24 Ultra with Galaxy AI features, titanium frame, 200MP camera, and built-in S Pen. The most powerful Galaxy experience with Snapdragon 8 Gen 3 processor.',
    price: 119999,
    originalPrice: 129999,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop',
    category: 'Smartphones',
    brand: 'Samsung',
    stock: 30,
    rating: 4.7,
    numReviews: 189,
    featured: true,
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    _id: 'p13',
    name: 'OnePlus 12',
    description: 'Flagship killer with Snapdragon 8 Gen 3, 50MP Hasselblad camera, 100W SUPERVOOC charging, and 2K 120Hz AMOLED display. Premium performance at competitive pricing.',
    price: 64999,
    originalPrice: 69999,
    discount: 7,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop',
    category: 'Smartphones',
    brand: 'OnePlus',
    stock: 28,
    rating: 4.6,
    numReviews: 412,
    featured: true,
    createdAt: '2024-02-10T00:00:00Z'
  },
  {
    _id: 'p14',
    name: 'Google Pixel 8 Pro',
    description: 'Pure Android experience with Tensor G3 chip, 50MP main camera with AI enhancements, 7 years of OS updates, and magic eraser features.',
    price: 92999,
    originalPrice: 106999,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop',
    category: 'Smartphones',
    brand: 'Google',
    stock: 18,
    rating: 4.7,
    numReviews: 267,
    createdAt: '2024-01-28T00:00:00Z'
  },
  // ===== LAPTOPS =====
  {
    _id: 'p4',
    name: 'MacBook Air M3',
    description: 'Supercharged by M3 chip with 8-core CPU and 10-core GPU. 15.3-inch Liquid Retina display, up to 18 hours battery life. Fanless design for silent performance.',
    price: 114999,
    originalPrice: 124999,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    category: 'Laptops',
    brand: 'Apple',
    stock: 20,
    rating: 4.8,
    numReviews: 312,
    featured: true,
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    _id: 'p11',
    name: 'Dell XPS 15 Laptop',
    description: 'Premium 15.6" laptop with 13th Gen Intel Core i7, 32GB RAM, and NVIDIA RTX 4060. InfinityEdge display with 3.5K OLED option. Crafted from aluminum and carbon fiber.',
    price: 159999,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&h=500&fit=crop',
    category: 'Laptops',
    brand: 'Dell',
    stock: 12,
    rating: 4.7,
    numReviews: 156,
    createdAt: '2024-02-28T00:00:00Z'
  },
  {
    _id: 'p15',
    name: 'Lenovo ThinkPad X1 Carbon',
    description: 'Ultra-light business laptop with 13th Gen Intel Core i7, 14" 2.8K OLED display, 32GB RAM, and military-grade durability. Best-in-class keyboard.',
    price: 144999,
    originalPrice: 159999,
    discount: 9,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
    category: 'Laptops',
    brand: 'Lenovo',
    stock: 15,
    rating: 4.6,
    numReviews: 198,
    createdAt: '2024-02-15T00:00:00Z'
  },
  {
    _id: 'p16',
    name: 'ASUS ROG Zephyrus G14',
    description: 'Gaming powerhouse with AMD Ryzen 9, RTX 4070, 14" QHD 165Hz display, and 32GB DDR5 RAM. Compact form factor with premium build quality.',
    price: 169999,
    originalPrice: 184999,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1603302576832-3b69f2a728fd?w=500&h=500&fit=crop',
    category: 'Laptops',
    brand: 'ASUS',
    stock: 10,
    rating: 4.8,
    numReviews: 145,
    featured: true,
    createdAt: '2024-03-05T00:00:00Z'
  },
  {
    _id: 'p17',
    name: 'HP Pavilion 15',
    description: 'Everyday laptop with Intel Core i5-1335U, 16GB RAM, 512GB SSD, and 15.6" FHD IPS display. Perfect for work and entertainment.',
    price: 59999,
    originalPrice: 67999,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop',
    category: 'Laptops',
    brand: 'HP',
    stock: 35,
    rating: 4.4,
    numReviews: 523,
    createdAt: '2024-01-20T00:00:00Z'
  },
  // ===== AUDIO =====
  {
    _id: 'p3',
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones. Up to 30 hours battery life with quick charging.',
    price: 29999,
    originalPrice: 34990,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop',
    category: 'Headphones',
    brand: 'Sony',
    stock: 45,
    rating: 4.9,
    numReviews: 567,
    featured: true,
    createdAt: '2024-01-20T00:00:00Z'
  },
  {
    _id: 'p9',
    name: 'Bose SoundLink Flex',
    description: 'Portable Bluetooth speaker with deep, clear sound. IP67 waterproof and dustproof. 12-hour battery life with PositionIQ technology for optimized sound.',
    price: 15999,
    originalPrice: 17900,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
    category: 'Headphones',
    brand: 'Bose',
    stock: 38,
    rating: 4.6,
    numReviews: 334,
    createdAt: '2024-03-05T00:00:00Z'
  },
  {
    _id: 'p18',
    name: 'JBL Tune 770NC',
    description: 'Wireless over-ear headphones with adaptive noise cancelling, 70-hour battery life, and JBL Pure Bass sound. Lightweight and comfortable for all-day wear.',
    price: 6999,
    originalPrice: 8999,
    discount: 22,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: 'Headphones',
    brand: 'JBL',
    stock: 60,
    rating: 4.5,
    numReviews: 892,
    createdAt: '2024-02-05T00:00:00Z'
  },
  {
    _id: 'p19',
    name: 'boAt Rockerz 550',
    description: 'Bluetooth over-ear headphones with 20-hour playback, 50mm drivers, and padded ear cushions. Foldable design with dual connectivity modes.',
    price: 1999,
    originalPrice: 3990,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop',
    category: 'Headphones',
    brand: 'boAt',
    stock: 100,
    rating: 4.3,
    numReviews: 2341,
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    _id: 'p20',
    name: 'Sennheiser HD 450BT',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery, and Sennheiser signature sound. Comfortable fit for extended listening.',
    price: 12999,
    originalPrice: 14990,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop',
    category: 'Headphones',
    brand: 'Sennheiser',
    stock: 25,
    rating: 4.6,
    numReviews: 445,
    createdAt: '2024-02-20T00:00:00Z'
  },
  // ===== SMART WATCHES =====
  {
    _id: 'p6',
    name: 'Apple Watch Series 9',
    description: 'The most powerful Apple Watch with S9 SiP chip. Double Tap gesture, brighter display, Precision Finding for iPhone, and advanced health features including blood oxygen.',
    price: 41999,
    originalPrice: 45999,
    discount: 9,
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500&h=500&fit=crop',
    category: 'Smart Watches',
    brand: 'Apple',
    stock: 35,
    rating: 4.7,
    numReviews: 278,
    featured: true,
    createdAt: '2024-02-15T00:00:00Z'
  },
  {
    _id: 'p21',
    name: 'Samsung Galaxy Watch 6',
    description: 'Advanced health monitoring with BIA sensor, sleep coaching, and enhanced GPS. Sapphire crystal display with Wear OS powered by Samsung.',
    price: 29999,
    originalPrice: 33999,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop',
    category: 'Smart Watches',
    brand: 'Samsung',
    stock: 28,
    rating: 4.5,
    numReviews: 356,
    createdAt: '2024-02-25T00:00:00Z'
  },
  {
    _id: 'p22',
    name: 'Noise ColorFit Pro 4',
    description: '1.72" HD display with Bluetooth calling, 100+ sports modes, SpO2 monitoring, and 7-day battery life. Affordable smartwatch with premium features.',
    price: 3499,
    originalPrice: 5999,
    discount: 42,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop',
    category: 'Smart Watches',
    brand: 'Noise',
    stock: 80,
    rating: 4.2,
    numReviews: 1876,
    createdAt: '2024-01-10T00:00:00Z'
  },
  // ===== GAMING =====
  {
    _id: 'p23',
    name: 'Logitech G Pro X Superlight',
    description: 'Ultra-lightweight wireless gaming mouse at 63g. HERO 25K sensor, LIGHTSPEED wireless, and 70-hour battery life. Used by esports professionals.',
    price: 11999,
    originalPrice: 13999,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
    category: 'Gaming',
    brand: 'Logitech',
    stock: 32,
    rating: 4.8,
    numReviews: 678,
    featured: true,
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    _id: 'p24',
    name: 'Razer BlackWidow V4',
    description: 'Premium mechanical gaming keyboard with Razer Green switches, RGB Chroma lighting, magnetic wrist rest, and dedicated media controls.',
    price: 16999,
    originalPrice: 19999,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop',
    category: 'Gaming',
    brand: 'Razer',
    stock: 22,
    rating: 4.7,
    numReviews: 234,
    createdAt: '2024-02-18T00:00:00Z'
  },
  {
    _id: 'p25',
    name: 'Corsair HS80 RGB Wireless',
    description: 'Premium wireless gaming headset with Dolby Atmos, broadcast-quality microphone, and 24-hour battery life. Spatial audio for immersive gaming.',
    price: 13999,
    originalPrice: 15999,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=500&h=500&fit=crop',
    category: 'Gaming',
    brand: 'Corsair',
    stock: 18,
    rating: 4.6,
    numReviews: 189,
    createdAt: '2024-02-22T00:00:00Z'
  },
  // ===== ACCESSORIES =====
  {
    _id: 'p8',
    name: 'Logitech MX Master 3S',
    description: 'Advanced wireless mouse with MagSpeed scroll, 8K DPI tracking, and quiet clicks. Ergonomic design with thumb wheel and customizable buttons for productivity.',
    price: 8999,
    originalPrice: 10999,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
    category: 'Accessories',
    brand: 'Logitech',
    stock: 40,
    rating: 4.8,
    numReviews: 623,
    createdAt: '2024-02-20T00:00:00Z'
  },
  {
    _id: 'p26',
    name: 'Anker 737 Power Bank',
    description: '24,000mAh power bank with 140W output, smart digital display, and PowerIQ 4.0 technology. Charge laptops, tablets, and phones simultaneously.',
    price: 9999,
    originalPrice: 12999,
    discount: 23,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop',
    category: 'Accessories',
    brand: 'Anker',
    stock: 45,
    rating: 4.7,
    numReviews: 445,
    createdAt: '2024-03-02T00:00:00Z'
  },
  {
    _id: 'p27',
    name: 'Portronics SoundDrum 1',
    description: 'Portable Bluetooth speaker with 10W output, TWS pairing, IPX5 water resistance, and 8-hour playback. Compact design for outdoor adventures.',
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500&h=500&fit=crop',
    category: 'Accessories',
    brand: 'Portronics',
    stock: 90,
    rating: 4.1,
    numReviews: 1234,
    createdAt: '2024-01-25T00:00:00Z'
  },
  // ===== HOME & LIFESTYLE =====
  {
    _id: 'p12',
    name: 'Kindle Paperwhite 11th Gen',
    description: '6.8" display with adjustable warm light. Waterproof design for reading anywhere. Up to 10 weeks battery life. 16GB storage for thousands of books.',
    price: 13999,
    originalPrice: 16999,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1594380492003-30e879b3ba44?w=500&h=500&fit=crop',
    category: 'Home & Lifestyle',
    brand: 'Amazon',
    stock: 6,
    rating: 4.9,
    numReviews: 892,
    featured: true,
    createdAt: '2024-03-10T00:00:00Z'
  },
  {
    _id: 'p28',
    name: 'Dyson V15 Detect',
    description: 'Cordless vacuum with laser dust detection, piezo sensor, and 60-minute runtime. Automatically adjusts suction power based on dust detected.',
    price: 52999,
    originalPrice: 62999,
    discount: 16,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&h=500&fit=crop',
    category: 'Home & Lifestyle',
    brand: 'Dyson',
    stock: 8,
    rating: 4.8,
    numReviews: 234,
    createdAt: '2024-02-28T00:00:00Z'
  },
  {
    _id: 'p29',
    name: 'Philips Air Fryer HD9252',
    description: 'Digital air fryer with Rapid Air technology, 4.1L capacity, and 7 preset cooking programs. Cook with up to 90% less fat for healthier meals.',
    price: 8999,
    originalPrice: 11999,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&h=500&fit=crop',
    category: 'Home & Lifestyle',
    brand: 'Philips',
    stock: 25,
    rating: 4.6,
    numReviews: 567,
    createdAt: '2024-03-03T00:00:00Z'
  },
  // ===== FASHION =====
  {
    _id: 'p5',
    name: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 features a large Max Air unit for a smooth, comfortable ride. Breathable mesh upper with dynamic flywire for a locked-in fit.',
    price: 12999,
    originalPrice: 14999,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    category: 'Fashion',
    brand: 'Nike',
    stock: 50,
    rating: 4.6,
    numReviews: 445,
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    _id: 'p10',
    name: 'Adidas Ultraboost 22',
    description: 'Responsive running shoe with Boost midsole for energy return. Primeknit+ upper adapts to your foot. Continental rubber outsole for grip in all conditions.',
    price: 14999,
    originalPrice: 17999,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=500&fit=crop',
    category: 'Fashion',
    brand: 'Adidas',
    stock: 42,
    rating: 4.5,
    numReviews: 389,
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    _id: 'p30',
    name: 'Puma RS-X³ Sneakers',
    description: 'Retro-futuristic sneakers with RS cushioning technology, mesh and suede upper, and chunky sole design. Bold color blocking for statement style.',
    price: 8999,
    originalPrice: 10999,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop',
    category: 'Fashion',
    brand: 'Puma',
    stock: 38,
    rating: 4.4,
    numReviews: 267,
    createdAt: '2024-02-12T00:00:00Z'
  },
  // ===== CAMERAS =====
  {
    _id: 'p7',
    name: 'Canon EOS R50 Camera',
    description: 'Compact mirrorless camera with 24.2MP APS-C sensor, 4K video, and advanced AF system. Perfect for content creators with subject detection and eye-tracking AF.',
    price: 74999,
    originalPrice: 82999,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop',
    category: 'Cameras',
    brand: 'Canon',
    stock: 15,
    rating: 4.5,
    numReviews: 98,
    createdAt: '2024-01-25T00:00:00Z'
  },
  {
    _id: 'p31',
    name: 'Sony Alpha A7 IV',
    description: 'Full-frame mirrorless camera with 33MP sensor, 4K 60p video, real-time eye AF, and 10fps continuous shooting. Professional-grade in a compact body.',
    price: 209999,
    originalPrice: 229990,
    discount: 9,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop',
    category: 'Cameras',
    brand: 'Sony',
    stock: 8,
    rating: 4.9,
    numReviews: 156,
    featured: true,
    createdAt: '2024-03-08T00:00:00Z'
  },
  {
    _id: 'p32',
    name: 'GoPro HERO12 Black',
    description: 'Action camera with 5.3K60 video, HyperSmooth 6.0 stabilization, waterproof to 10m, and HDR photo and video. Perfect for adventure content.',
    price: 44999,
    originalPrice: 52999,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?w=500&h=500&fit=crop',
    category: 'Cameras',
    brand: 'GoPro',
    stock: 20,
    rating: 4.7,
    numReviews: 334,
    createdAt: '2024-02-15T00:00:00Z'
  },
  // ===== TABLETS =====
  {
    _id: 'p33',
    name: 'iPad Air M2',
    description: '11-inch Liquid Retina display, M2 chip, 256GB storage, Apple Pencil support. Perfect for creativity and productivity on the go.',
    price: 69999,
    originalPrice: 79999,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
    category: 'Tablets',
    brand: 'Apple',
    stock: 18,
    rating: 4.8,
    numReviews: 289,
    featured: true,
    createdAt: '2024-03-12T00:00:00Z'
  },
  {
    _id: 'p34',
    name: 'Samsung Galaxy Tab S9',
    description: '11-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 2, S Pen included, IP68 water resistance. Premium Android tablet experience.',
    price: 64999,
    originalPrice: 74999,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop',
    category: 'Tablets',
    brand: 'Samsung',
    stock: 22,
    rating: 4.6,
    numReviews: 198,
    createdAt: '2024-02-28T00:00:00Z'
  },
  {
    _id: 'p35',
    name: 'Xiaomi Pad 6',
    description: '11-inch 2.8K display, Snapdragon 870, 6GB RAM, 128GB storage. Great value tablet with premium features.',
    price: 24999,
    originalPrice: 29999,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1625842268584-8f32a6c27b6c?w=500&h=500&fit=crop',
    category: 'Tablets',
    brand: 'Xiaomi',
    stock: 35,
    rating: 4.4,
    numReviews: 456,
    createdAt: '2024-01-20T00:00:00Z'
  },
  {
    _id: 'p36',
    name: 'Lenovo Tab P11 Pro',
    description: '11.5-inch 2.5K OLED display, MediaTek Kompanio 1300T, JBL quad speakers, productivity mode with keyboard.',
    price: 34999,
    originalPrice: 42999,
    discount: 19,
    image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500&h=500&fit=crop',
    category: 'Tablets',
    brand: 'Lenovo',
    stock: 28,
    rating: 4.5,
    numReviews: 234,
    createdAt: '2024-02-15T00:00:00Z'
  },
  // ===== TVs & HOME ENTERTAINMENT =====
  {
    _id: 'p37',
    name: 'Sony Bravia XR A95L',
    description: '55-inch QD-OLED TV with Cognitive Processor XR, Dolby Atmos, Google TV, and perfect blacks. Cinema experience at home.',
    price: 249999,
    originalPrice: 279999,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop',
    category: 'TVs & Home Entertainment',
    brand: 'Sony',
    stock: 8,
    rating: 4.9,
    numReviews: 145,
    featured: true,
    createdAt: '2024-03-15T00:00:00Z'
  },
  {
    _id: 'p38',
    name: 'Samsung QN90C Neo QLED',
    description: '65-inch 4K Neo QLED TV with Neural Quantum Processor, Object Tracking Sound, and Gaming Hub. Stunning picture quality.',
    price: 189999,
    originalPrice: 219999,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500&h=500&fit=crop',
    category: 'TVs & Home Entertainment',
    brand: 'Samsung',
    stock: 12,
    rating: 4.7,
    numReviews: 267,
    createdAt: '2024-02-20T00:00:00Z'
  },
  {
    _id: 'p39',
    name: 'LG C3 OLED',
    description: '65-inch 4K OLED evo TV with α9 Gen6 AI Processor, Dolby Vision & Atmos, webOS 23, and perfect for gaming with 0.1ms response.',
    price: 179999,
    originalPrice: 209999,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1571415060716-baff5f717068?w=500&h=500&fit=crop',
    category: 'TVs & Home Entertainment',
    brand: 'LG',
    stock: 10,
    rating: 4.8,
    numReviews: 312,
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    _id: 'p40',
    name: 'Mi Soundbar',
    description: '120W wireless Bluetooth soundbar with Dolby Audio, HDMI ARC, optical input, and USB. Immersive sound for your TV.',
    price: 7999,
    originalPrice: 9999,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&h=500&fit=crop',
    category: 'TVs & Home Entertainment',
    brand: 'Xiaomi',
    stock: 45,
    rating: 4.3,
    numReviews: 678,
    createdAt: '2024-01-25T00:00:00Z'
  },
  // ===== KITCHEN APPLIANCES =====
  {
    _id: 'p41',
    name: 'Instant Pot Duo 7-in-1',
    description: 'Electric pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer. 6-quart capacity.',
    price: 8999,
    originalPrice: 11999,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&h=500&fit=crop',
    category: 'Kitchen Appliances',
    brand: 'Instant Pot',
    stock: 30,
    rating: 4.7,
    numReviews: 892,
    createdAt: '2024-02-10T00:00:00Z'
  },
  {
    _id: 'p42',
    name: 'KitchenAid Stand Mixer',
    description: 'Iconic tilt-head stand mixer with 10 speeds, 5-quart bowl, and 15+ optional attachments. Professional results at home.',
    price: 34999,
    originalPrice: 39999,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1594385208974-2f8bb07fafe6?w=500&h=500&fit=crop',
    category: 'Kitchen Appliances',
    brand: 'KitchenAid',
    stock: 15,
    rating: 4.8,
    numReviews: 445,
    featured: true,
    createdAt: '2024-03-05T00:00:00Z'
  },
  {
    _id: 'p43',
    name: 'Nespresso Vertuo Next',
    description: 'Coffee and espresso maker with centrifusion technology, 5 cup sizes, and 30-second heat-up time. Barista-quality at home.',
    price: 14999,
    originalPrice: 17999,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&h=500&fit=crop',
    category: 'Kitchen Appliances',
    brand: 'Nespresso',
    stock: 25,
    rating: 4.6,
    numReviews: 567,
    createdAt: '2024-02-18T00:00:00Z'
  },
  {
    _id: 'p44',
    name: 'Philips Airfryer XXL',
    description: 'Digital air fryer with Fat Removal technology, 7.3L capacity, Keep Warm function, and 90% less fat cooking.',
    price: 19999,
    originalPrice: 24999,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&h=500&fit=crop',
    category: 'Kitchen Appliances',
    brand: 'Philips',
    stock: 20,
    rating: 4.7,
    numReviews: 678,
    createdAt: '2024-03-08T00:00:00Z'
  },
  // ===== FITNESS & SPORTS =====
  {
    _id: 'p45',
    name: 'Garmin Forerunner 265',
    description: 'Advanced running GPS watch with AMOLED display, training readiness, race predictor, and 13-day battery life.',
    price: 44999,
    originalPrice: 49999,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop',
    category: 'Fitness & Sports',
    brand: 'Garmin',
    stock: 18,
    rating: 4.8,
    numReviews: 234,
    createdAt: '2024-03-10T00:00:00Z'
  },
  {
    _id: 'p46',
    name: 'Fitbit Charge 6',
    description: 'Advanced fitness tracker with GPS, heart rate zones, stress management, and 7-day battery. Track 40+ exercise modes.',
    price: 13999,
    originalPrice: 15999,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop',
    category: 'Fitness & Sports',
    brand: 'Fitbit',
    stock: 35,
    rating: 4.5,
    numReviews: 456,
    createdAt: '2024-02-25T00:00:00Z'
  },
  {
    _id: 'p47',
    name: 'Yoga Mat Premium',
    description: '6mm thick non-slip yoga mat with alignment lines, eco-friendly TPE material, and carrying strap. Perfect for yoga and pilates.',
    price: 1999,
    originalPrice: 2999,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1601925260368-ab22b4a6b4b8?w=500&h=500&fit=crop',
    category: 'Fitness & Sports',
    brand: 'Boldfit',
    stock: 80,
    rating: 4.4,
    numReviews: 1234,
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    _id: 'p48',
    name: 'Adjustable Dumbbells Set',
    description: 'Pair of adjustable dumbbells 5-52.5 lbs each, quick-change dial system, compact design. Replace 15 sets of weights.',
    price: 29999,
    originalPrice: 39999,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=500&fit=crop',
    category: 'Fitness & Sports',
    brand: 'Bowflex',
    stock: 12,
    rating: 4.7,
    numReviews: 345,
    createdAt: '2024-02-28T00:00:00Z'
  },
  // ===== BOOKS & STATIONERY =====
  {
    _id: 'p49',
    name: 'Atomic Habits by James Clear',
    description: 'Bestselling book on building good habits and breaking bad ones. Proven framework for improving every day.',
    price: 399,
    originalPrice: 799,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
    category: 'Books & Stationery',
    brand: 'Penguin',
    stock: 150,
    rating: 4.9,
    numReviews: 5678,
    featured: true,
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    _id: 'p50',
    name: 'Moleskine Classic Notebook',
    description: 'Hardcover ruled notebook, 240 pages, ivory paper, ribbon bookmark, and expandable inner pocket. Premium writing experience.',
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&h=500&fit=crop',
    category: 'Books & Stationery',
    brand: 'Moleskine',
    stock: 60,
    rating: 4.6,
    numReviews: 892,
    createdAt: '2024-02-12T00:00:00Z'
  },
  {
    _id: 'p51',
    name: 'Fountain Pen Set',
    description: 'Premium fountain pen with converter, 6 ink cartridges, and gift box. Smooth writing experience for professionals.',
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1583952734649-e4d5a98a0a2c?w=500&h=500&fit=crop',
    category: 'Books & Stationery',
    brand: 'Parker',
    stock: 40,
    rating: 4.5,
    numReviews: 234,
    createdAt: '2024-03-01T00:00:00Z'
  },
  // ===== BEAUTY & PERSONAL CARE =====
  {
    _id: 'p52',
    name: 'Dyson Airwrap Styler',
    description: 'Multi-styler with intelligent heat control, 6 attachments, and no extreme heat damage. Salon-quality styling at home.',
    price: 49999,
    originalPrice: 55999,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&h=500&fit=crop',
    category: 'Beauty & Personal Care',
    brand: 'Dyson',
    stock: 15,
    rating: 4.8,
    numReviews: 567,
    featured: true,
    createdAt: '2024-03-12T00:00:00Z'
  },
  {
    _id: 'p53',
    name: 'Philips Beard Trimmer 9000',
    description: 'Vacuum beard trimmer with Lift & Trim Pro, 20 length settings, and 90-minute runtime. Professional grooming at home.',
    price: 7999,
    originalPrice: 9999,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=500&h=500&fit=crop',
    category: 'Beauty & Personal Care',
    brand: 'Philips',
    stock: 45,
    rating: 4.6,
    numReviews: 892,
    createdAt: '2024-02-20T00:00:00Z'
  },
  {
    _id: 'p54',
    name: 'Foreo Luna 3',
    description: 'Facial cleansing device with T-Sonic pulsations and anti-aging massage. 16 intensities for deep cleansing and firming.',
    price: 19999,
    originalPrice: 24999,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop',
    category: 'Beauty & Personal Care',
    brand: 'Foreo',
    stock: 20,
    rating: 4.7,
    numReviews: 345,
    createdAt: '2024-03-05T00:00:00Z'
  },
  {
    _id: 'p55',
    name: 'Skincare Gift Set',
    description: 'Complete skincare routine with cleanser, toner, serum, moisturizer, and eye cream. Suitable for all skin types.',
    price: 4999,
    originalPrice: 6999,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop',
    category: 'Beauty & Personal Care',
    brand: 'Minimalist',
    stock: 50,
    rating: 4.5,
    numReviews: 678,
    createdAt: '2024-02-28T00:00:00Z'
  },
  // ===== BABY PRODUCTS =====
  {
    _id: 'p56',
    name: 'Baby Monitor Video',
    description: '1080p HD video baby monitor with night vision, two-way talk, temperature sensor, and lullabies. 1000ft range.',
    price: 8999,
    originalPrice: 11999,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop',
    category: 'Baby Products',
    brand: 'Motorola',
    stock: 30,
    rating: 4.6,
    numReviews: 456,
    createdAt: '2024-02-15T00:00:00Z'
  },
  {
    _id: 'p57',
    name: 'Baby Stroller Lightweight',
    description: 'Ultra-lightweight foldable stroller with one-hand fold, UV 50+ canopy, and reclining seat. Perfect for travel.',
    price: 12999,
    originalPrice: 16999,
    discount: 24,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop',
    category: 'Baby Products',
    brand: 'Chicco',
    stock: 18,
    rating: 4.5,
    numReviews: 234,
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    _id: 'p58',
    name: 'Baby Care Gift Set',
    description: 'Complete baby care set with shampoo, body wash, lotion, powder, and oil. Gentle formula for sensitive skin.',
    price: 1999,
    originalPrice: 2999,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop',
    category: 'Baby Products',
    brand: 'Johnson & Johnson',
    stock: 60,
    rating: 4.7,
    numReviews: 1234,
    createdAt: '2024-01-20T00:00:00Z'
  },
  // ===== PET SUPPLIES =====
  {
    _id: 'p59',
    name: 'Automatic Pet Feeder',
    description: 'Smart pet feeder with 4L capacity, scheduled feeding, voice recording, and app control. Keep your pet fed on time.',
    price: 5999,
    originalPrice: 7999,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop',
    category: 'Pet Supplies',
    brand: 'Petkit',
    stock: 25,
    rating: 4.5,
    numReviews: 345,
    createdAt: '2024-02-25T00:00:00Z'
  },
  {
    _id: 'p60',
    name: 'Dog Bed Orthopedic',
    description: 'Memory foam orthopedic dog bed with washable cover, non-slip bottom, and supportive design. Perfect for senior dogs.',
    price: 3999,
    originalPrice: 5999,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop',
    category: 'Pet Supplies',
    brand: 'PetStar',
    stock: 40,
    rating: 4.6,
    numReviews: 567,
    createdAt: '2024-03-05T00:00:00Z'
  },
  {
    _id: 'p61',
    name: 'Cat Tree Tower',
    description: 'Multi-level cat tree with scratching posts, cozy condos, dangling toys, and plush platforms. 55-inch tall.',
    price: 6999,
    originalPrice: 9999,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop',
    category: 'Pet Supplies',
    brand: 'FEANDRA',
    stock: 20,
    rating: 4.4,
    numReviews: 234,
    createdAt: '2024-02-28T00:00:00Z'
  },
  // ===== MORE SMARTPHONES =====
  {
    _id: 'p62',
    name: 'Realme GT 5 Pro',
    description: 'Snapdragon 8 Gen 3, 50MP Sony IMX890 camera, 2K 144Hz display, 100W charging. Flagship performance at mid-range price.',
    price: 44999,
    originalPrice: 49999,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop',
    category: 'Smartphones',
    brand: 'Realme',
    stock: 30,
    rating: 4.5,
    numReviews: 289,
    createdAt: '2024-03-08T00:00:00Z'
  },
  {
    _id: 'p63',
    name: 'Vivo X100 Pro',
    description: 'Zeiss optics, 50MP main camera, Dimensity 9300, 120W flash charging. Professional photography in your pocket.',
    price: 74999,
    originalPrice: 84999,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop',
    category: 'Smartphones',
    brand: 'Vivo',
    stock: 22,
    rating: 4.6,
    numReviews: 198,
    createdAt: '2024-03-10T00:00:00Z'
  },
  // ===== MORE LAPTOPS =====
  {
    _id: 'p64',
    name: 'MacBook Pro 14 M3 Pro',
    description: 'M3 Pro chip, 14.2-inch Liquid Retina XDR, 18GB RAM, 512GB SSD. Up to 17-hour battery life. Built for pros.',
    price: 199999,
    originalPrice: 219999,
    discount: 9,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    category: 'Laptops',
    brand: 'Apple',
    stock: 12,
    rating: 4.9,
    numReviews: 234,
    featured: true,
    createdAt: '2024-03-15T00:00:00Z'
  },
  {
    _id: 'p65',
    name: 'Acer Swift 3',
    description: '14-inch 2K display, AMD Ryzen 7, 16GB RAM, 512GB SSD, fingerprint reader. Lightweight and powerful.',
    price: 59999,
    originalPrice: 69999,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
    category: 'Laptops',
    brand: 'Acer',
    stock: 28,
    rating: 4.4,
    numReviews: 456,
    createdAt: '2024-02-20T00:00:00Z'
  },
  // ===== MORE HEADPHONES =====
  {
    _id: 'p66',
    name: 'AirPods Pro 2',
    description: 'Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio, and USB-C charging. Up to 6 hours listening.',
    price: 24999,
    originalPrice: 26999,
    discount: 7,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&h=500&fit=crop',
    category: 'Headphones',
    brand: 'Apple',
    stock: 50,
    rating: 4.8,
    numReviews: 1234,
    featured: true,
    createdAt: '2024-03-12T00:00:00Z'
  },
  {
    _id: 'p67',
    name: 'Samsung Galaxy Buds2 Pro',
    description: 'Intelligent ANC, 360 Audio, 24bit high-fidelity sound, and IPX7 water resistance. Seamless Galaxy ecosystem integration.',
    price: 15999,
    originalPrice: 17999,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&h=500&fit=crop',
    category: 'Headphones',
    brand: 'Samsung',
    stock: 40,
    rating: 4.6,
    numReviews: 567,
    createdAt: '2024-02-28T00:00:00Z'
  },
  // ===== MORE SMART WATCHES =====
  {
    _id: 'p68',
    name: 'Amazfit GTR 4',
    description: '1.43-inch AMOLED, 150+ sports modes, 14-day battery, GPS, and health monitoring. Premium smartwatch at great value.',
    price: 14999,
    originalPrice: 17999,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop',
    category: 'Smart Watches',
    brand: 'Amazfit',
    stock: 45,
    rating: 4.5,
    numReviews: 678,
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    _id: 'p69',
    name: 'Fossil Gen 6',
    description: 'Wear OS smartwatch with Snapdragon 4100+, 1.28-inch AMOLED, fast charging, and classic design. Style meets technology.',
    price: 19999,
    originalPrice: 24999,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop',
    category: 'Smart Watches',
    brand: 'Fossil',
    stock: 25,
    rating: 4.4,
    numReviews: 345,
    createdAt: '2024-02-15T00:00:00Z'
  },
  // ===== MORE GAMING =====
  {
    _id: 'p70',
    name: 'PlayStation 5 Slim',
    description: 'Next-gen gaming console with 4K gaming, ray tracing, 1TB SSD, and DualSense controller. Experience PS5 games.',
    price: 49999,
    originalPrice: 54999,
    discount: 9,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop',
    category: 'Gaming',
    brand: 'Sony',
    stock: 15,
    rating: 4.9,
    numReviews: 892,
    featured: true,
    createdAt: '2024-03-15T00:00:00Z'
  },
  {
    _id: 'p71',
    name: 'Xbox Series X',
    description: 'Most powerful Xbox with 12 TFLOPS, 1TB custom SSD, 4K gaming at 120fps, and Quick Resume. Next-gen gaming.',
    price: 49999,
    originalPrice: 54999,
    discount: 9,
    image: 'https://images.unsplash.com/photo-1621259182978-e1585e4c0530?w=500&h=500&fit=crop',
    category: 'Gaming',
    brand: 'Microsoft',
    stock: 12,
    rating: 4.8,
    numReviews: 567,
    createdAt: '2024-03-10T00:00:00Z'
  },
  // ===== MORE ACCESSORIES =====
  {
    _id: 'p72',
    name: 'Apple AirPods Max',
    description: 'Over-ear headphones with High-Fidelity Audio, Active Noise Cancellation, and Spatial Audio. Premium Apple experience.',
    price: 59999,
    originalPrice: 64999,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&h=500&fit=crop',
    category: 'Accessories',
    brand: 'Apple',
    stock: 18,
    rating: 4.7,
    numReviews: 345,
    createdAt: '2024-03-05T00:00:00Z'
  },
  {
    _id: 'p73',
    name: 'Belkin Wireless Charger',
    description: '3-in-1 wireless charging station for iPhone, Apple Watch, and AirPods. 15W fast charging with alignment magnets.',
    price: 9999,
    originalPrice: 12999,
    discount: 23,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop',
    category: 'Accessories',
    brand: 'Belkin',
    stock: 35,
    rating: 4.5,
    numReviews: 456,
    createdAt: '2024-02-28T00:00:00Z'
  },
  // ===== MORE HOME & LIFESTYLE =====
  {
    _id: 'p74',
    name: 'iRobot Roomba j7+',
    description: 'Robot vacuum with PrecisionVision Navigation, self-emptying base, and smart mapping. Avoids obstacles intelligently.',
    price: 54999,
    originalPrice: 64999,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&h=500&fit=crop',
    category: 'Home & Lifestyle',
    brand: 'iRobot',
    stock: 10,
    rating: 4.6,
    numReviews: 234,
    createdAt: '2024-03-08T00:00:00Z'
  },
  {
    _id: 'p75',
    name: 'Philips Hue Starter Kit',
    description: 'Smart lighting kit with 3 color bulbs, bridge, and dimmer switch. 16 million colors, voice control compatible.',
    price: 14999,
    originalPrice: 17999,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop',
    category: 'Home & Lifestyle',
    brand: 'Philips',
    stock: 25,
    rating: 4.7,
    numReviews: 567,
    createdAt: '2024-03-01T00:00:00Z'
  },
  // ===== MORE FASHION =====
  {
    _id: 'p76',
    name: 'Ray-Ban Aviator Classic',
    description: 'Iconic aviator sunglasses with gold frame, green G-15 lenses, and crystal lenses. Timeless style since 1937.',
    price: 8999,
    originalPrice: 10999,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop',
    category: 'Fashion',
    brand: 'Ray-Ban',
    stock: 40,
    rating: 4.8,
    numReviews: 892,
    createdAt: '2024-02-20T00:00:00Z'
  },
  {
    _id: 'p77',
    name: 'Levi\'s 511 Slim Jeans',
    description: 'Classic slim fit jeans with stretch for comfort. Sits below waist, slim through thigh, narrow leg opening.',
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
    category: 'Fashion',
    brand: 'Levi\'s',
    stock: 60,
    rating: 4.5,
    numReviews: 1234,
    createdAt: '2024-01-25T00:00:00Z'
  },
  // ===== MORE CAMERAS =====
  {
    _id: 'p78',
    name: 'Fujifilm X-T5',
    description: '40MP X-Trans CMOS 5 HR sensor, 6.2K video, film simulation modes, and classic retro design. Photography art.',
    price: 159999,
    originalPrice: 174999,
    discount: 9,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop',
    category: 'Cameras',
    brand: 'Fujifilm',
    stock: 10,
    rating: 4.8,
    numReviews: 189,
    createdAt: '2024-03-12T00:00:00Z'
  },
  // ===== FASHION - MEN =====
  {
    _id: 'p79',
    name: 'Classic White Oxford Shirt',
    description: 'Premium cotton oxford shirt with button-down collar. Perfect for formal and casual occasions. Slim fit design.',
    price: 1299,
    originalPrice: 2499,
    discount: 48,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop'
    ],
    category: 'Men',
    subcategory: 'Shirts',
    brand: 'Raymond',
    stock: 150,
    rating: 4.5,
    numReviews: 2341,
    featured: true,
    gender: 'Men',
    color: 'White',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: '100% Cotton',
    fit: 'Slim Fit',
    occasion: 'Formal',
    createdAt: '2024-03-15T00:00:00Z'
  },
  {
    _id: 'p80',
    name: 'Slim Fit Dark Blue Jeans',
    description: 'Stretchable denim jeans with comfortable fit. Classic 5-pocket design with premium stitching.',
    price: 1799,
    originalPrice: 3999,
    discount: 55,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
    category: 'Men',
    subcategory: 'Jeans',
    brand: 'Levis',
    stock: 200,
    rating: 4.6,
    numReviews: 5678,
    featured: true,
    gender: 'Men',
    color: 'Blue',
    sizes: ['28', '30', '32', '34', '36', '38'],
    fabric: '98% Cotton, 2% Elastane',
    fit: 'Slim Fit',
    occasion: 'Casual',
    createdAt: '2024-03-14T00:00:00Z'
  },
  {
    _id: 'p81',
    name: 'Graphic Print T-Shirt',
    description: 'Comfortable cotton t-shirt with trendy graphic print. Round neck and half sleeves.',
    price: 599,
    originalPrice: 1299,
    discount: 54,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    category: 'Men',
    subcategory: 'T-Shirts',
    brand: 'Roadster',
    stock: 300,
    rating: 4.3,
    numReviews: 8923,
    gender: 'Men',
    color: 'Black',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: '100% Cotton',
    fit: 'Regular Fit',
    occasion: 'Casual',
    createdAt: '2024-03-13T00:00:00Z'
  },
  {
    _id: 'p82',
    name: 'Formal Blazer',
    description: 'Premium wool blend blazer with notch lapel. Single-breasted design with two buttons.',
    price: 4999,
    originalPrice: 8999,
    discount: 44,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&h=500&fit=crop',
    category: 'Men',
    subcategory: 'Jackets',
    brand: 'Louis Philippe',
    stock: 80,
    rating: 4.7,
    numReviews: 1234,
    featured: true,
    gender: 'Men',
    color: 'Navy Blue',
    sizes: ['38', '40', '42', '44', '46'],
    fabric: 'Wool Blend',
    fit: 'Regular Fit',
    occasion: 'Formal',
    createdAt: '2024-03-12T00:00:00Z'
  },
  {
    _id: 'p83',
    name: 'Casual Hoodie',
    description: 'Warm fleece hoodie with kangaroo pocket. Drawstring hood and ribbed cuffs.',
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
    category: 'Men',
    subcategory: 'Hoodies',
    brand: 'HRX',
    stock: 180,
    rating: 4.4,
    numReviews: 3456,
    gender: 'Men',
    color: 'Grey',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Fleece',
    fit: 'Regular Fit',
    occasion: 'Casual',
    createdAt: '2024-03-11T00:00:00Z'
  },
  // ===== FASHION - WOMEN =====
  {
    _id: 'p84',
    name: 'Floral Maxi Dress',
    description: 'Elegant floral print maxi dress with V-neck and flutter sleeves. Flowy silhouette perfect for summer.',
    price: 1899,
    originalPrice: 3999,
    discount: 53,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=500&fit=crop',
    category: 'Women',
    subcategory: 'Dresses',
    brand: 'Sassafras',
    stock: 120,
    rating: 4.6,
    numReviews: 4567,
    featured: true,
    gender: 'Women',
    color: 'Multi',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Polyester',
    fit: 'Regular Fit',
    occasion: 'Casual',
    createdAt: '2024-03-15T00:00:00Z'
  },
  {
    _id: 'p85',
    name: 'Anarkali Kurti',
    description: 'Traditional anarkali kurti with intricate embroidery. Flared silhouette with 3/4th sleeves.',
    price: 1299,
    originalPrice: 2799,
    discount: 54,
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=500&fit=crop',
    category: 'Women',
    subcategory: 'Kurtis',
    brand: 'Biba',
    stock: 150,
    rating: 4.5,
    numReviews: 6789,
    featured: true,
    gender: 'Women',
    color: 'Red',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Cotton',
    fit: 'Flared',
    occasion: 'Ethnic',
    createdAt: '2024-03-14T00:00:00Z'
  },
  {
    _id: 'p86',
    name: 'High Waist Skinny Jeans',
    description: 'Stretchable high-waist skinny jeans with comfortable fit. Classic 5-pocket design.',
    price: 1599,
    originalPrice: 3499,
    discount: 54,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=500&fit=crop',
    category: 'Women',
    subcategory: 'Jeans',
    brand: 'Only',
    stock: 200,
    rating: 4.4,
    numReviews: 7890,
    gender: 'Women',
    color: 'Black',
    sizes: ['26', '28', '30', '32', '34'],
    fabric: '98% Cotton, 2% Elastane',
    fit: 'Skinny',
    occasion: 'Casual',
    createdAt: '2024-03-13T00:00:00Z'
  },
  {
    _id: 'p87',
    name: 'Silk Saree',
    description: 'Pure silk saree with golden border and blouse piece. Traditional weave with modern design.',
    price: 3999,
    originalPrice: 7999,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=500&fit=crop',
    category: 'Women',
    subcategory: 'Sarees',
    brand: 'Saree Mall',
    stock: 60,
    rating: 4.8,
    numReviews: 2345,
    featured: true,
    gender: 'Women',
    color: 'Pink',
    sizes: ['Free Size'],
    fabric: 'Pure Silk',
    fit: 'Free Size',
    occasion: 'Festive',
    createdAt: '2024-03-12T00:00:00Z'
  },
  {
    _id: 'p88',
    name: 'Crop Top',
    description: 'Trendy crop top with round neck and sleeveless design. Perfect for layering or standalone wear.',
    price: 699,
    originalPrice: 1499,
    discount: 53,
    image: 'https://images.unsplash.com/photo-1564257577-2d3ee8740ef2?w=500&h=500&fit=crop',
    category: 'Women',
    subcategory: 'Tops',
    brand: 'Mast & Harbour',
    stock: 250,
    rating: 4.3,
    numReviews: 5678,
    gender: 'Women',
    color: 'White',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Polyester',
    fit: 'Regular Fit',
    occasion: 'Casual',
    createdAt: '2024-03-11T00:00:00Z'
  },
  // ===== FOOTWEAR =====
  {
    _id: 'p89',
    name: 'Running Shoes',
    description: 'Lightweight running shoes with mesh upper and cushioned sole. Breathable and comfortable.',
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    category: 'Footwear',
    subcategory: 'Running Shoes',
    brand: 'Nike',
    stock: 180,
    rating: 4.7,
    numReviews: 9012,
    featured: true,
    gender: 'Unisex',
    color: 'Red',
    sizes: ['6', '7', '8', '9', '10', '11'],
    fabric: 'Mesh',
    occasion: 'Sports',
    createdAt: '2024-03-15T00:00:00Z'
  },
  {
    _id: 'p90',
    name: 'Classic Sneakers',
    description: 'White leather sneakers with rubber sole. Clean minimal design for everyday wear.',
    price: 1999,
    originalPrice: 3999,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop',
    category: 'Footwear',
    subcategory: 'Sneakers',
    brand: 'Adidas',
    stock: 220,
    rating: 4.6,
    numReviews: 12345,
    featured: true,
    gender: 'Unisex',
    color: 'White',
    sizes: ['6', '7', '8', '9', '10', '11'],
    fabric: 'Leather',
    occasion: 'Casual',
    createdAt: '2024-03-14T00:00:00Z'
  },
  {
    _id: 'p91',
    name: 'Stiletto Heels',
    description: 'Elegant stiletto heels with pointed toe. Perfect for parties and formal occasions.',
    price: 2299,
    originalPrice: 4599,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',
    category: 'Footwear',
    subcategory: 'Heels',
    brand: 'Catwalk',
    stock: 100,
    rating: 4.4,
    numReviews: 3456,
    gender: 'Women',
    color: 'Black',
    sizes: ['5', '6', '7', '8', '9'],
    fabric: 'Synthetic',
    occasion: 'Party',
    createdAt: '2024-03-13T00:00:00Z'
  },
  {
    _id: 'p92',
    name: 'Sports Sandals',
    description: 'Comfortable sports sandals with adjustable straps. Cushioned footbed for all-day comfort.',
    price: 1299,
    originalPrice: 2599,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=500&fit=crop',
    category: 'Footwear',
    subcategory: 'Sandals',
    brand: 'Puma',
    stock: 160,
    rating: 4.5,
    numReviews: 5678,
    gender: 'Unisex',
    color: 'Blue',
    sizes: ['6', '7', '8', '9', '10', '11'],
    fabric: 'Synthetic',
    occasion: 'Casual',
    createdAt: '2024-03-12T00:00:00Z'
  },
  // ===== BEAUTY =====
  {
    _id: 'p93',
    name: 'Vitamin C Serum',
    description: 'Brightening vitamin C serum with hyaluronic acid. Reduces dark spots and improves skin texture.',
    price: 599,
    originalPrice: 1299,
    discount: 54,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop',
    category: 'Beauty',
    subcategory: 'Skincare',
    brand: 'Minimalist',
    stock: 300,
    rating: 4.6,
    numReviews: 8901,
    featured: true,
    gender: 'Unisex',
    createdAt: '2024-03-15T00:00:00Z'
  },
  {
    _id: 'p94',
    name: 'Matte Lipstick Set',
    description: 'Set of 6 matte lipsticks in trending shades. Long-lasting formula with smooth application.',
    price: 899,
    originalPrice: 1999,
    discount: 55,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop',
    category: 'Beauty',
    subcategory: 'Makeup',
    brand: 'Lakme',
    stock: 250,
    rating: 4.5,
    numReviews: 6789,
    featured: true,
    gender: 'Women',
    createdAt: '2024-03-14T00:00:00Z'
  },
  {
    _id: 'p95',
    name: 'Eau De Parfum',
    description: 'Long-lasting eau de parfum with fresh and woody notes. Perfect for daily wear.',
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop',
    category: 'Beauty',
    subcategory: 'Perfumes',
    brand: 'Fogg',
    stock: 180,
    rating: 4.4,
    numReviews: 4567,
    gender: 'Men',
    createdAt: '2024-03-13T00:00:00Z'
  },
  // ===== ACCESSORIES =====
  {
    _id: 'p96',
    name: 'Analog Watch',
    description: 'Premium analog watch with leather strap. Water-resistant with date display.',
    price: 2999,
    originalPrice: 5999,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop',
    category: 'Accessories',
    subcategory: 'Watches',
    brand: 'Fossil',
    stock: 120,
    rating: 4.7,
    numReviews: 3456,
    featured: true,
    gender: 'Men',
    color: 'Brown',
    createdAt: '2024-03-15T00:00:00Z'
  },
  {
    _id: 'p97',
    name: 'Leather Handbag',
    description: 'Spacious leather handbag with multiple compartments. Elegant design for everyday use.',
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop',
    category: 'Accessories',
    subcategory: 'Bags',
    brand: 'Lavie',
    stock: 90,
    rating: 4.5,
    numReviews: 2345,
    featured: true,
    gender: 'Women',
    color: 'Black',
    createdAt: '2024-03-14T00:00:00Z'
  },
  {
    _id: 'p98',
    name: 'Aviator Sunglasses',
    description: 'Classic aviator sunglasses with UV protection. Metal frame with gradient lenses.',
    price: 1299,
    originalPrice: 2599,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop',
    category: 'Accessories',
    subcategory: 'Sunglasses',
    brand: 'Ray-Ban',
    stock: 150,
    rating: 4.8,
    numReviews: 7890,
    featured: true,
    gender: 'Unisex',
    color: 'Gold',
    createdAt: '2024-03-13T00:00:00Z'
  },
  {
    _id: 'p99',
    name: 'Gold Plated Necklace',
    description: 'Elegant gold plated necklace with pendant. Perfect for parties and special occasions.',
    price: 1799,
    originalPrice: 3599,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&h=500&fit=crop',
    category: 'Accessories',
    subcategory: 'Jewelry',
    brand: 'Giva',
    stock: 80,
    rating: 4.6,
    numReviews: 1234,
    featured: true,
    gender: 'Women',
    color: 'Gold',
    createdAt: '2024-03-12T00:00:00Z'
  },
  // ===== HOME =====
  {
    _id: 'p100',
    name: 'Cotton Bedsheet Set',
    description: 'Premium cotton bedsheet set with 2 pillow covers. Soft and breathable fabric.',
    price: 1299,
    originalPrice: 2599,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70308?w=500&h=500&fit=crop',
    category: 'Home',
    subcategory: 'Bedsheets',
    brand: 'Portico',
    stock: 200,
    rating: 4.5,
    numReviews: 5678,
    gender: 'Unisex',
    color: 'White',
    createdAt: '2024-03-15T00:00:00Z'
  },
  {
    _id: 'p101',
    name: 'Designer Curtains',
    description: 'Elegant designer curtains with blackout lining. Perfect for bedroom and living room.',
    price: 1999,
    originalPrice: 3999,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&h=500&fit=crop',
    category: 'Home',
    subcategory: 'Curtains',
    brand: 'Arrabi',
    stock: 120,
    rating: 4.4,
    numReviews: 2345,
    gender: 'Unisex',
    color: 'Grey',
    createdAt: '2024-03-14T00:00:00Z'
  },
  {
    _id: 'p102',
    name: 'Decorative Cushions',
    description: 'Set of 4 decorative cushion covers with embroidered design. Soft and durable fabric.',
    price: 899,
    originalPrice: 1799,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop',
    category: 'Home',
    subcategory: 'Decor',
    brand: 'Home Sizzler',
    stock: 180,
    rating: 4.3,
    numReviews: 3456,
    gender: 'Unisex',
    color: 'Multi',
    createdAt: '2024-03-13T00:00:00Z'
  }
];

// Initialize data
function initializeStore() {
  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(seedProducts));
  }
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }
  if (!localStorage.getItem('carts')) {
    localStorage.setItem('carts', JSON.stringify([]));
  }
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('wishlists')) {
    localStorage.setItem('wishlists', JSON.stringify([]));
  }
}

initializeStore();

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function hashPassword(password: string): string {
  // Simple hash for demo (in real backend, bcrypt would be used)
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hashed_' + Math.abs(hash).toString(36) + '_' + password.length;
}

function verifyPassword(password: string, hashed: string): boolean {
  return hashPassword(password) === hashed;
}

function generateToken(userId: string): string {
  return btoa(JSON.stringify({ userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
}

function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded.exp < Date.now()) return null;
    return { userId: decoded.userId };
  } catch {
    return null;
  }
}

// Products API
export const productsAPI = {
  getAll(filters?: { keyword?: string; category?: string; sort?: string; minPrice?: number; maxPrice?: number; minRating?: number; featured?: boolean }): Product[] {
    let products = JSON.parse(localStorage.getItem('products') || '[]') as Product[];
    
    if (filters?.keyword) {
      const kw = filters.keyword.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(kw) || p.brand.toLowerCase().includes(kw) || p.category.toLowerCase().includes(kw));
    }
    if (filters?.category && filters.category !== 'All') {
      products = products.filter(p => p.category === filters.category);
    }
    if (filters?.minPrice !== undefined) {
      products = products.filter(p => p.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      products = products.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters?.minRating !== undefined && filters.minRating > 0) {
      products = products.filter(p => p.rating >= filters.minRating!);
    }
    if (filters?.featured) {
      products = products.filter(p => p.featured);
    }
    if (filters?.sort) {
      switch (filters.sort) {
        case 'price_low': products.sort((a, b) => a.price - b.price); break;
        case 'price_high': products.sort((a, b) => b.price - a.price); break;
        case 'rating': products.sort((a, b) => b.rating - a.rating); break;
        case 'newest': products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
        case 'popular': products.sort((a, b) => b.numReviews - a.numReviews); break;
        case 'discount': products.sort((a, b) => (b.discount || 0) - (a.discount || 0)); break;
      }
    }
    return products;
  },

  getById(id: string): Product | null {
    const products = JSON.parse(localStorage.getItem('products') || '[]') as Product[];
    return products.find(p => p._id === id) || null;
  },

  getCategories(): string[] {
    const products = JSON.parse(localStorage.getItem('products') || '[]') as Product[];
    return [...new Set(products.map(p => p.category))];
  }
};

// Auth API
export const authAPI = {
  register(name: string, email: string, password: string): { user: User; token: string } | { error: string } {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    
    if (users.find(u => u.email === email.toLowerCase())) {
      return { error: 'Email already registered' };
    }
    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters' };
    }

    const user: User = {
      _id: generateId(),
      name,
      email: email.toLowerCase(),
      password: hashPassword(password),
      role: 'user'
    };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    const token = generateToken(user._id);
    return { user: { ...user, password: '' }, token };
  },

  login(email: string, password: string): { user: User; token: string } | { error: string } {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const user = users.find(u => u.email === email.toLowerCase());
    
    if (!user) return { error: 'Invalid email or password' };
    if (!verifyPassword(password, user.password)) return { error: 'Invalid email or password' };

    const token = generateToken(user._id);
    return { user: { ...user, password: '' }, token };
  },

  getMe(token: string): User | null {
    const decoded = verifyToken(token);
    if (!decoded) return null;
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const user = users.find(u => u._id === decoded.userId);
    if (!user) return null;
    return { ...user, password: '' };
  },

  getCurrentUser(): { user: User; token: string } | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const user = this.getMe(token);
    if (!user) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      return null;
    }
    return { user, token };
  }
};

// Cart API
export const cartAPI = {
  getCart(userId: string): Cart {
    const carts = JSON.parse(localStorage.getItem('carts') || '[]') as Cart[];
    let cart = carts.find(c => c.user === userId);
    if (!cart) {
      cart = { user: userId, items: [] };
      carts.push(cart);
      localStorage.setItem('carts', JSON.stringify(carts));
    }
    return cart;
  },

  addItem(userId: string, productId: string, quantity: number = 1): Cart {
    const product = productsAPI.getById(productId);
    if (!product) throw new Error('Product not found');
    
    const carts = JSON.parse(localStorage.getItem('carts') || '[]') as Cart[];
    let cart = carts.find(c => c.user === userId);
    if (!cart) {
      cart = { user: userId, items: [] };
      carts.push(cart);
    }

    const existingItem = cart.items.find(i => i.product === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        name: product.name,
        image: product.image,
        brand: product.brand
      });
    }

    const idx = carts.findIndex(c => c.user === userId);
    if (idx >= 0) carts[idx] = cart;
    else carts.push(cart);
    localStorage.setItem('carts', JSON.stringify(carts));
    return cart;
  },

  updateItem(userId: string, productId: string, quantity: number): Cart {
    const carts = JSON.parse(localStorage.getItem('carts') || '[]') as Cart[];
    let cart = carts.find(c => c.user === userId);
    if (!cart) throw new Error('Cart not found');

    const item = cart.items.find(i => i.product === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
    }

    const idx = carts.findIndex(c => c.user === userId);
    carts[idx] = cart;
    localStorage.setItem('carts', JSON.stringify(carts));
    return cart;
  },

  removeItem(userId: string, productId: string): Cart {
    const carts = JSON.parse(localStorage.getItem('carts') || '[]') as Cart[];
    let cart = carts.find(c => c.user === userId);
    if (!cart) throw new Error('Cart not found');

    cart.items = cart.items.filter(i => i.product !== productId);
    const idx = carts.findIndex(c => c.user === userId);
    carts[idx] = cart;
    localStorage.setItem('carts', JSON.stringify(carts));
    return cart;
  },

  clearCart(userId: string): void {
    const carts = JSON.parse(localStorage.getItem('carts') || '[]') as Cart[];
    const idx = carts.findIndex(c => c.user === userId);
    if (idx >= 0) {
      carts[idx] = { user: userId, items: [] };
      localStorage.setItem('carts', JSON.stringify(carts));
    }
  },

  getItemCount(userId: string): number {
    const cart = this.getCart(userId);
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal(userId: string): number {
    const cart = this.getCart(userId);
    return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
};

// Orders API
export const ordersAPI = {
  placeOrder(userId: string, shippingAddress: Order['shippingAddress'], paymentMethod: string): Order {
    const cart = cartAPI.getCart(userId);
    if (cart.items.length === 0) throw new Error('Cart is empty');

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 5000 ? 0 : 199;
    const totalPrice = subtotal + shipping;

    const order: Order = {
      _id: generateId(),
      user: userId,
      orderItems: cart.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        product: item.product,
        image: item.image
      })),
      shippingAddress,
      paymentMethod,
      totalPrice,
      status: 'Pending',
      isPaid: paymentMethod !== 'COD',
      createdAt: new Date().toISOString()
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    cartAPI.clearCart(userId);
    return order;
  },

  getMyOrders(userId: string): Order[] {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
    return orders.filter(o => o.user === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getOrderById(orderId: string, userId: string): Order | null {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
    return orders.find(o => o._id === orderId && o.user === userId) || null;
  }
};

// Wishlist API
export const wishlistAPI = {
  getWishlist(userId: string): Wishlist {
    const wishlists = JSON.parse(localStorage.getItem('wishlists') || '[]') as Wishlist[];
    let wishlist = wishlists.find(w => w.user === userId);
    if (!wishlist) {
      wishlist = { user: userId, items: [] };
      wishlists.push(wishlist);
      localStorage.setItem('wishlists', JSON.stringify(wishlists));
    }
    return wishlist;
  },

  addToWishlist(userId: string, productId: string): Wishlist {
    const wishlists = JSON.parse(localStorage.getItem('wishlists') || '[]') as Wishlist[];
    let wishlist = wishlists.find(w => w.user === userId);
    if (!wishlist) {
      wishlist = { user: userId, items: [] };
      wishlists.push(wishlist);
    }

    if (!wishlist.items.includes(productId)) {
      wishlist.items.push(productId);
    }

    const idx = wishlists.findIndex(w => w.user === userId);
    if (idx >= 0) wishlists[idx] = wishlist;
    else wishlists.push(wishlist);
    localStorage.setItem('wishlists', JSON.stringify(wishlists));
    return wishlist;
  },

  removeFromWishlist(userId: string, productId: string): Wishlist {
    const wishlists = JSON.parse(localStorage.getItem('wishlists') || '[]') as Wishlist[];
    let wishlist = wishlists.find(w => w.user === userId);
    if (!wishlist) return { user: userId, items: [] };

    wishlist.items = wishlist.items.filter(id => id !== productId);
    const idx = wishlists.findIndex(w => w.user === userId);
    wishlists[idx] = wishlist;
    localStorage.setItem('wishlists', JSON.stringify(wishlists));
    return wishlist;
  },

  isInWishlist(userId: string, productId: string): boolean {
    const wishlist = this.getWishlist(userId);
    return wishlist.items.includes(productId);
  },

  getWishlistCount(userId: string): number {
    const wishlist = this.getWishlist(userId);
    return wishlist.items.length;
  },

  getWishlistProducts(userId: string): Product[] {
    const wishlist = this.getWishlist(userId);
    return wishlist.items.map(id => productsAPI.getById(id)).filter(p => p !== null) as Product[];
  }
};

// Utility
export function formatPrice(price: number): string {
  return '₹' + price.toLocaleString('en-IN');
}

export function getShipping(subtotal: number): number {
  return subtotal >= 5000 ? 0 : 199;
}
