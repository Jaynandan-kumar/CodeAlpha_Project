const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const products = [
  // ===== SMARTPHONES =====
  { name: 'Apple iPhone 15 Pro', description: 'Titanium design, A17 Pro chip, 48MP camera. Most powerful iPhone with USB-C and Action button.', price: 129999, originalPrice: 134999, discount: 4, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop', category: 'Smartphones', brand: 'Apple', stock: 25, rating: 4.8, numReviews: 234, featured: true },
  { name: 'Samsung Galaxy S24 Ultra', description: 'Galaxy AI, titanium frame, 200MP camera, S Pen. Snapdragon 8 Gen 3 processor.', price: 119999, originalPrice: 129999, discount: 8, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop', category: 'Smartphones', brand: 'Samsung', stock: 30, rating: 4.7, numReviews: 189, featured: true },
  { name: 'OnePlus 12', description: 'Snapdragon 8 Gen 3, 50MP Hasselblad camera, 100W charging, 2K 120Hz AMOLED.', price: 64999, originalPrice: 69999, discount: 7, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop', category: 'Smartphones', brand: 'OnePlus', stock: 28, rating: 4.6, numReviews: 412, featured: true },
  { name: 'Google Pixel 8 Pro', description: 'Tensor G3, 50MP AI camera, 7 years OS updates, magic eraser.', price: 92999, originalPrice: 106999, discount: 13, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop', category: 'Smartphones', brand: 'Google', stock: 18, rating: 4.7, numReviews: 267 },
  
  // ===== LAPTOPS =====
  { name: 'MacBook Air M3', description: 'M3 chip, 8-core CPU, 10-core GPU, 15.3" display, 18hr battery. Fanless design.', price: 114999, originalPrice: 124999, discount: 8, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop', category: 'Laptops', brand: 'Apple', stock: 20, rating: 4.8, numReviews: 312, featured: true },
  { name: 'Dell XPS 15', description: '13th Gen Intel i7, 32GB RAM, RTX 4060, 3.5K OLED InfinityEdge.', price: 159999, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&h=500&fit=crop', category: 'Laptops', brand: 'Dell', stock: 12, rating: 4.7, numReviews: 156 },
  { name: 'Lenovo ThinkPad X1 Carbon', description: 'Intel i7, 14" 2.8K OLED, 32GB RAM, military-grade durability.', price: 144999, originalPrice: 159999, discount: 9, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop', category: 'Laptops', brand: 'Lenovo', stock: 15, rating: 4.6, numReviews: 198 },
  { name: 'ASUS ROG Zephyrus G14', description: 'AMD Ryzen 9, RTX 4070, 14" QHD 165Hz, 32GB DDR5. Gaming powerhouse.', price: 169999, originalPrice: 184999, discount: 8, image: 'https://images.unsplash.com/photo-1603302576832-3b6d3fc62b89?w=500&h=500&fit=crop', category: 'Laptops', brand: 'ASUS', stock: 10, rating: 4.8, numReviews: 145, featured: true },
  { name: 'HP Pavilion 15', description: 'Intel i5-1335U, 16GB RAM, 512GB SSD, 15.6" FHD IPS.', price: 59999, originalPrice: 67999, discount: 12, image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop', category: 'Laptops', brand: 'HP', stock: 35, rating: 4.4, numReviews: 523 },
  
  // ===== HEADPHONES =====
  { name: 'Sony WH-1000XM5', description: 'Industry-leading noise cancellation, 30hr battery, 4 beamforming mics.', price: 29999, originalPrice: 34990, discount: 14, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop', category: 'Headphones', brand: 'Sony', stock: 45, rating: 4.9, numReviews: 567, featured: true },
  { name: 'Bose SoundLink Flex', description: 'Portable Bluetooth speaker, IP67 waterproof, 12hr battery, PositionIQ.', price: 15999, originalPrice: 17900, discount: 11, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop', category: 'Headphones', brand: 'Bose', stock: 38, rating: 4.6, numReviews: 334 },
  { name: 'JBL Tune 770NC', description: 'Adaptive noise cancelling, 70hr battery, JBL Pure Bass.', price: 6999, originalPrice: 8999, discount: 22, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', category: 'Headphones', brand: 'JBL', stock: 60, rating: 4.5, numReviews: 892 },
  { name: 'boAt Rockerz 550', description: '20hr playback, 50mm drivers, padded cushions, foldable.', price: 1999, originalPrice: 3990, discount: 50, image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop', category: 'Headphones', brand: 'boAt', stock: 100, rating: 4.3, numReviews: 2341 },
  { name: 'Sennheiser HD 450BT', description: 'Active noise cancellation, 30hr battery, signature sound.', price: 12999, originalPrice: 14990, discount: 13, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop', category: 'Headphones', brand: 'Sennheiser', stock: 25, rating: 4.6, numReviews: 445 },
  
  // ===== SMART WATCHES =====
  { name: 'Apple Watch Series 9', description: 'S9 SiP chip, Double Tap, brighter display, health features.', price: 41999, originalPrice: 45999, discount: 9, image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500&h=500&fit=crop', category: 'Smart Watches', brand: 'Apple', stock: 35, rating: 4.7, numReviews: 278, featured: true },
  { name: 'Samsung Galaxy Watch 6', description: 'BIA sensor, sleep coaching, GPS, Sapphire crystal, Wear OS.', price: 29999, originalPrice: 33999, discount: 12, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop', category: 'Smart Watches', brand: 'Samsung', stock: 28, rating: 4.5, numReviews: 356 },
  { name: 'Noise ColorFit Pro 4', description: '1.72" HD, Bluetooth calling, 100+ sports, SpO2, 7-day battery.', price: 3499, originalPrice: 5999, discount: 42, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop', category: 'Smart Watches', brand: 'Noise', stock: 80, rating: 4.2, numReviews: 1876 },
  
  // ===== GAMING =====
  { name: 'Logitech G Pro X Superlight', description: '63g wireless gaming mouse, HERO 25K, LIGHTSPEED, 70hr battery.', price: 11999, originalPrice: 13999, discount: 14, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', category: 'Gaming', brand: 'Logitech', stock: 32, rating: 4.8, numReviews: 678, featured: true },
  { name: 'Razer BlackWidow V4', description: 'Mechanical keyboard, Green switches, RGB Chroma, media controls.', price: 16999, originalPrice: 19999, discount: 15, image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop', category: 'Gaming', brand: 'Razer', stock: 22, rating: 4.7, numReviews: 234 },
  { name: 'Corsair HS80 RGB Wireless', description: 'Dolby Atmos, broadcast mic, 24hr battery, spatial audio.', price: 13999, originalPrice: 15999, discount: 13, image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=500&h=500&fit=crop', category: 'Gaming', brand: 'Corsair', stock: 18, rating: 4.6, numReviews: 189 },
  
  // ===== ACCESSORIES =====
  { name: 'Logitech MX Master 3S', description: 'MagSpeed scroll, 8K DPI, quiet clicks, thumb wheel.', price: 8999, originalPrice: 10999, discount: 18, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', category: 'Accessories', brand: 'Logitech', stock: 40, rating: 4.8, numReviews: 623 },
  { name: 'Anker 737 Power Bank', description: '24,000mAh, 140W output, digital display, PowerIQ 4.0.', price: 9999, originalPrice: 12999, discount: 23, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop', category: 'Accessories', brand: 'Anker', stock: 45, rating: 4.7, numReviews: 445 },
  { name: 'Portronics SoundDrum 1', description: '10W Bluetooth speaker, TWS, IPX5, 8hr playback.', price: 1499, originalPrice: 2999, discount: 50, image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500&h=500&fit=crop', category: 'Accessories', brand: 'Portronics', stock: 90, rating: 4.1, numReviews: 1234 },
  
  // ===== HOME & LIFESTYLE =====
  { name: 'Kindle Paperwhite', description: '6.8" display, warm light, waterproof, 10-week battery, 16GB.', price: 13999, originalPrice: 16999, discount: 18, image: 'https://images.unsplash.com/photo-1594380492003-30e879b3ba44?w=500&h=500&fit=crop', category: 'Home & Lifestyle', brand: 'Amazon', stock: 6, rating: 4.9, numReviews: 892, featured: true },
  { name: 'Dyson V15 Detect', description: 'Laser dust detection, piezo sensor, 60min runtime, auto suction.', price: 52999, originalPrice: 62999, discount: 16, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&h=500&fit=crop', category: 'Home & Lifestyle', brand: 'Dyson', stock: 8, rating: 4.8, numReviews: 234 },
  { name: 'Philips Air Fryer HD9252', description: 'Rapid Air tech, 4.1L, 7 presets, 90% less fat.', price: 8999, originalPrice: 11999, discount: 25, image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&h=500&fit=crop', category: 'Home & Lifestyle', brand: 'Philips', stock: 25, rating: 4.6, numReviews: 567 },
  
  // ===== FASHION =====
  { name: 'Nike Air Max 270', description: 'Max Air unit, breathable mesh, dynamic flywire.', price: 12999, originalPrice: 14999, discount: 13, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop', category: 'Fashion', brand: 'Nike', stock: 50, rating: 4.6, numReviews: 445 },
  { name: 'Adidas Ultraboost 22', description: 'Boost midsole, Primeknit+, Continental rubber outsole.', price: 14999, originalPrice: 17999, discount: 17, image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=500&fit=crop', category: 'Fashion', brand: 'Adidas', stock: 42, rating: 4.5, numReviews: 389 },
  { name: 'Puma RS-X³', description: 'RS cushioning, mesh/suede upper, chunky sole, bold colors.', price: 8999, originalPrice: 10999, discount: 18, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop', category: 'Fashion', brand: 'Puma', stock: 38, rating: 4.4, numReviews: 267 },
  
  // ===== CAMERAS =====
  { name: 'Canon EOS R50', description: '24.2MP APS-C, 4K video, advanced AF, eye-tracking.', price: 74999, originalPrice: 82999, discount: 10, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop', category: 'Cameras', brand: 'Canon', stock: 15, rating: 4.5, numReviews: 98 },
  { name: 'Sony Alpha A7 IV', description: '33MP full-frame, 4K 60p, real-time eye AF, 10fps.', price: 209999, originalPrice: 229990, discount: 9, image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop', category: 'Cameras', brand: 'Sony', stock: 8, rating: 4.9, numReviews: 156, featured: true },
  { name: 'GoPro HERO12 Black', description: '5.3K60, HyperSmooth 6.0, waterproof 10m, HDR.', price: 44999, originalPrice: 52999, discount: 15, image: 'https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?w=500&h=500&fit=crop', category: 'Cameras', brand: 'GoPro', stock: 20, rating: 4.7, numReviews: 334 },
  
  // ===== TABLETS =====
  { name: 'iPad Air M2', description: '11-inch Liquid Retina display, M2 chip, 256GB storage, Apple Pencil support. Perfect for creativity and productivity on the go.', price: 69999, originalPrice: 79999, discount: 13, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop', category: 'Tablets', brand: 'Apple', stock: 18, rating: 4.8, numReviews: 289, featured: true },
  { name: 'Samsung Galaxy Tab S9', description: '11-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 2, S Pen included, IP68 water resistance. Premium Android tablet experience.', price: 64999, originalPrice: 74999, discount: 13, image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop', category: 'Tablets', brand: 'Samsung', stock: 22, rating: 4.6, numReviews: 198 },
  { name: 'Xiaomi Pad 6', description: '11-inch 2.8K display, Snapdragon 870, 6GB RAM, 128GB storage. Great value tablet with premium features.', price: 24999, originalPrice: 29999, discount: 17, image: 'https://images.unsplash.com/photo-1625842268584-8f32a6c27b6c?w=500&h=500&fit=crop', category: 'Tablets', brand: 'Xiaomi', stock: 35, rating: 4.4, numReviews: 456 },
  { name: 'Lenovo Tab P11 Pro', description: '11.5-inch 2.5K OLED display, MediaTek Kompanio 1300T, JBL quad speakers, productivity mode with keyboard.', price: 34999, originalPrice: 42999, discount: 19, image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500&h=500&fit=crop', category: 'Tablets', brand: 'Lenovo', stock: 28, rating: 4.5, numReviews: 234 },
  
  // ===== TVs & HOME ENTERTAINMENT =====
  { name: 'Sony Bravia XR A95L', description: '55-inch QD-OLED TV with Cognitive Processor XR, Dolby Atmos, Google TV, and perfect blacks. Cinema experience at home.', price: 249999, originalPrice: 279999, discount: 11, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop', category: 'TVs & Home Entertainment', brand: 'Sony', stock: 8, rating: 4.9, numReviews: 145, featured: true },
  { name: 'Samsung QN90C Neo QLED', description: '65-inch 4K Neo QLED TV with Neural Quantum Processor, Object Tracking Sound, and Gaming Hub. Stunning picture quality.', price: 189999, originalPrice: 219999, discount: 14, image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500&h=500&fit=crop', category: 'TVs & Home Entertainment', brand: 'Samsung', stock: 12, rating: 4.7, numReviews: 267 },
  { name: 'LG C3 OLED', description: '65-inch 4K OLED evo TV with α9 Gen6 AI Processor, Dolby Vision & Atmos, webOS 23, and perfect for gaming with 0.1ms response.', price: 179999, originalPrice: 209999, discount: 14, image: 'https://images.unsplash.com/photo-1571415060716-baff5f717068?w=500&h=500&fit=crop', category: 'TVs & Home Entertainment', brand: 'LG', stock: 10, rating: 4.8, numReviews: 312 },
  { name: 'Mi Soundbar', description: '120W wireless Bluetooth soundbar with Dolby Audio, HDMI ARC, optical input, and USB. Immersive sound for your TV.', price: 7999, originalPrice: 9999, discount: 20, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&h=500&fit=crop', category: 'TVs & Home Entertainment', brand: 'Xiaomi', stock: 45, rating: 4.3, numReviews: 678 },
  
  // ===== KITCHEN APPLIANCES =====
  { name: 'Instant Pot Duo 7-in-1', description: 'Electric pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer. 6-quart capacity.', price: 8999, originalPrice: 11999, discount: 25, image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&h=500&fit=crop', category: 'Kitchen Appliances', brand: 'Instant Pot', stock: 30, rating: 4.7, numReviews: 892 },
  { name: 'KitchenAid Stand Mixer', description: 'Iconic tilt-head stand mixer with 10 speeds, 5-quart bowl, and 15+ optional attachments. Professional results at home.', price: 34999, originalPrice: 39999, discount: 13, image: 'https://images.unsplash.com/photo-1594385208974-2f8bb07fafe6?w=500&h=500&fit=crop', category: 'Kitchen Appliances', brand: 'KitchenAid', stock: 15, rating: 4.8, numReviews: 445, featured: true },
  { name: 'Nespresso Vertuo Next', description: 'Coffee and espresso maker with centrifusion technology, 5 cup sizes, and 30-second heat-up time. Barista-quality at home.', price: 14999, originalPrice: 17999, discount: 17, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&h=500&fit=crop', category: 'Kitchen Appliances', brand: 'Nespresso', stock: 25, rating: 4.6, numReviews: 567 },
  { name: 'Philips Airfryer XXL', description: 'Digital air fryer with Fat Removal technology, 7.3L capacity, Keep Warm function, and 90% less fat cooking.', price: 19999, originalPrice: 24999, discount: 20, image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&h=500&fit=crop', category: 'Kitchen Appliances', brand: 'Philips', stock: 20, rating: 4.7, numReviews: 678 },
  
  // ===== FITNESS & SPORTS =====
  { name: 'Garmin Forerunner 265', description: 'Advanced running GPS watch with AMOLED display, training readiness, race predictor, and 13-day battery life.', price: 44999, originalPrice: 49999, discount: 10, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop', category: 'Fitness & Sports', brand: 'Garmin', stock: 18, rating: 4.8, numReviews: 234 },
  { name: 'Fitbit Charge 6', description: 'Advanced fitness tracker with GPS, heart rate zones, stress management, and 7-day battery. Track 40+ exercise modes.', price: 13999, originalPrice: 15999, discount: 13, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop', category: 'Fitness & Sports', brand: 'Fitbit', stock: 35, rating: 4.5, numReviews: 456 },
  { name: 'Yoga Mat Premium', description: '6mm thick non-slip yoga mat with alignment lines, eco-friendly TPE material, and carrying strap. Perfect for yoga and pilates.', price: 1999, originalPrice: 2999, discount: 33, image: 'https://images.unsplash.com/photo-1601925260368-ab22b4a6b4b8?w=500&h=500&fit=crop', category: 'Fitness & Sports', brand: 'Boldfit', stock: 80, rating: 4.4, numReviews: 1234 },
  { name: 'Adjustable Dumbbells Set', description: 'Pair of adjustable dumbbells 5-52.5 lbs each, quick-change dial system, compact design. Replace 15 sets of weights.', price: 29999, originalPrice: 39999, discount: 25, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=500&fit=crop', category: 'Fitness & Sports', brand: 'Bowflex', stock: 12, rating: 4.7, numReviews: 345 },
  
  // ===== BOOKS & STATIONERY =====
  { name: 'Atomic Habits by James Clear', description: 'Bestselling book on building good habits and breaking bad ones. Proven framework for improving every day.', price: 399, originalPrice: 799, discount: 50, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop', category: 'Books & Stationery', brand: 'Penguin', stock: 150, rating: 4.9, numReviews: 5678, featured: true },
  { name: 'Moleskine Classic Notebook', description: 'Hardcover ruled notebook, 240 pages, ivory paper, ribbon bookmark, and expandable inner pocket. Premium writing experience.', price: 1499, originalPrice: 1999, discount: 25, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&h=500&fit=crop', category: 'Books & Stationery', brand: 'Moleskine', stock: 60, rating: 4.6, numReviews: 892 },
  { name: 'Fountain Pen Set', description: 'Premium fountain pen with converter, 6 ink cartridges, and gift box. Smooth writing experience for professionals.', price: 2499, originalPrice: 3499, discount: 29, image: 'https://images.unsplash.com/photo-1583952734649-e4d5a98a0a2c?w=500&h=500&fit=crop', category: 'Books & Stationery', brand: 'Parker', stock: 40, rating: 4.5, numReviews: 234 },
  
  // ===== BEAUTY & PERSONAL CARE =====
  { name: 'Dyson Airwrap Styler', description: 'Multi-styler with intelligent heat control, 6 attachments, and no extreme heat damage. Salon-quality styling at home.', price: 49999, originalPrice: 55999, discount: 11, image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&h=500&fit=crop', category: 'Beauty & Personal Care', brand: 'Dyson', stock: 15, rating: 4.8, numReviews: 567, featured: true },
  { name: 'Philips Beard Trimmer 9000', description: 'Vacuum beard trimmer with Lift & Trim Pro, 20 length settings, and 90-minute runtime. Professional grooming at home.', price: 7999, originalPrice: 9999, discount: 20, image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=500&h=500&fit=crop', category: 'Beauty & Personal Care', brand: 'Philips', stock: 45, rating: 4.6, numReviews: 892 },
  { name: 'Foreo Luna 3', description: 'Facial cleansing device with T-Sonic pulsations and anti-aging massage. 16 intensities for deep cleansing and firming.', price: 19999, originalPrice: 24999, discount: 20, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop', category: 'Beauty & Personal Care', brand: 'Foreo', stock: 20, rating: 4.7, numReviews: 345 },
  { name: 'Skincare Gift Set', description: 'Complete skincare routine with cleanser, toner, serum, moisturizer, and eye cream. Suitable for all skin types.', price: 4999, originalPrice: 6999, discount: 29, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop', category: 'Beauty & Personal Care', brand: 'Minimalist', stock: 50, rating: 4.5, numReviews: 678 },
  
  // ===== BABY PRODUCTS =====
  { name: 'Baby Monitor Video', description: '1080p HD video baby monitor with night vision, two-way talk, temperature sensor, and lullabies. 1000ft range.', price: 8999, originalPrice: 11999, discount: 25, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop', category: 'Baby Products', brand: 'Motorola', stock: 30, rating: 4.6, numReviews: 456 },
  { name: 'Baby Stroller Lightweight', description: 'Ultra-lightweight foldable stroller with one-hand fold, UV 50+ canopy, and reclining seat. Perfect for travel.', price: 12999, originalPrice: 16999, discount: 24, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop', category: 'Baby Products', brand: 'Chicco', stock: 18, rating: 4.5, numReviews: 234 },
  { name: 'Baby Care Gift Set', description: 'Complete baby care set with shampoo, body wash, lotion, powder, and oil. Gentle formula for sensitive skin.', price: 1999, originalPrice: 2999, discount: 33, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop', category: 'Baby Products', brand: 'Johnson & Johnson', stock: 60, rating: 4.7, numReviews: 1234 },
  
  // ===== PET SUPPLIES =====
  { name: 'Automatic Pet Feeder', description: 'Smart pet feeder with 4L capacity, scheduled feeding, voice recording, and app control. Keep your pet fed on time.', price: 5999, originalPrice: 7999, discount: 25, image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop', category: 'Pet Supplies', brand: 'Petkit', stock: 25, rating: 4.5, numReviews: 345 },
  { name: 'Dog Bed Orthopedic', description: 'Memory foam orthopedic dog bed with washable cover, non-slip bottom, and supportive design. Perfect for senior dogs.', price: 3999, originalPrice: 5999, discount: 33, image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop', category: 'Pet Supplies', brand: 'PetStar', stock: 40, rating: 4.6, numReviews: 567 },
  { name: 'Cat Tree Tower', description: 'Multi-level cat tree with scratching posts, cozy condos, dangling toys, and plush platforms. 55-inch tall.', price: 6999, originalPrice: 9999, discount: 30, image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop', category: 'Pet Supplies', brand: 'FEANDRA', stock: 20, rating: 4.4, numReviews: 234 },
  
  // ===== MORE SMARTPHONES =====
  { name: 'Realme GT 5 Pro', description: 'Snapdragon 8 Gen 3, 50MP Sony IMX890 camera, 2K 144Hz display, 100W charging. Flagship performance at mid-range price.', price: 44999, originalPrice: 49999, discount: 10, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop', category: 'Smartphones', brand: 'Realme', stock: 30, rating: 4.5, numReviews: 289 },
  { name: 'Vivo X100 Pro', description: 'Zeiss optics, 50MP main camera, Dimensity 9300, 120W flash charging. Professional photography in your pocket.', price: 74999, originalPrice: 84999, discount: 12, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop', category: 'Smartphones', brand: 'Vivo', stock: 22, rating: 4.6, numReviews: 198 },
  
  // ===== MORE LAPTOPS =====
  { name: 'MacBook Pro 14 M3 Pro', description: 'M3 Pro chip, 14.2-inch Liquid Retina XDR, 18GB RAM, 512GB SSD. Up to 17-hour battery life. Built for pros.', price: 199999, originalPrice: 219999, discount: 9, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop', category: 'Laptops', brand: 'Apple', stock: 12, rating: 4.9, numReviews: 234, featured: true },
  { name: 'Acer Swift 3', description: '14-inch 2K display, AMD Ryzen 7, 16GB RAM, 512GB SSD, fingerprint reader. Lightweight and powerful.', price: 59999, originalPrice: 69999, discount: 14, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop', category: 'Laptops', brand: 'Acer', stock: 28, rating: 4.4, numReviews: 456 },
  
  // ===== MORE HEADPHONES =====
  { name: 'AirPods Pro 2', description: 'Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio, and USB-C charging. Up to 6 hours listening.', price: 24999, originalPrice: 26999, discount: 7, image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&h=500&fit=crop', category: 'Headphones', brand: 'Apple', stock: 50, rating: 4.8, numReviews: 1234, featured: true },
  { name: 'Samsung Galaxy Buds2 Pro', description: 'Intelligent ANC, 360 Audio, 24bit high-fidelity sound, and IPX7 water resistance. Seamless Galaxy ecosystem integration.', price: 15999, originalPrice: 17999, discount: 11, image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&h=500&fit=crop', category: 'Headphones', brand: 'Samsung', stock: 40, rating: 4.6, numReviews: 567 },
  
  // ===== MORE SMART WATCHES =====
  { name: 'Amazfit GTR 4', description: '1.43-inch AMOLED, 150+ sports modes, 14-day battery, GPS, and health monitoring. Premium smartwatch at great value.', price: 14999, originalPrice: 17999, discount: 17, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop', category: 'Smart Watches', brand: 'Amazfit', stock: 45, rating: 4.5, numReviews: 678 },
  { name: 'Fossil Gen 6', description: 'Wear OS smartwatch with Snapdragon 4100+, 1.28-inch AMOLED, fast charging, and classic design. Style meets technology.', price: 19999, originalPrice: 24999, discount: 20, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop', category: 'Smart Watches', brand: 'Fossil', stock: 25, rating: 4.4, numReviews: 345 },
  
  // ===== MORE GAMING =====
  { name: 'PlayStation 5 Slim', description: 'Next-gen gaming console with 4K gaming, ray tracing, 1TB SSD, and DualSense controller. Experience PS5 games.', price: 49999, originalPrice: 54999, discount: 9, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop', category: 'Gaming', brand: 'Sony', stock: 15, rating: 4.9, numReviews: 892, featured: true },
  { name: 'Xbox Series X', description: 'Most powerful Xbox with 12 TFLOPS, 1TB custom SSD, 4K gaming at 120fps, and Quick Resume. Next-gen gaming.', price: 49999, originalPrice: 54999, discount: 9, image: 'https://images.unsplash.com/photo-1621259182978-e1585e4c0530?w=500&h=500&fit=crop', category: 'Gaming', brand: 'Microsoft', stock: 12, rating: 4.8, numReviews: 567 },
  
  // ===== MORE ACCESSORIES =====
  { name: 'Apple AirPods Max', description: 'Over-ear headphones with High-Fidelity Audio, Active Noise Cancellation, and Spatial Audio. Premium Apple experience.', price: 59999, originalPrice: 64999, discount: 8, image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&h=500&fit=crop', category: 'Accessories', brand: 'Apple', stock: 18, rating: 4.7, numReviews: 345 },
  { name: 'Belkin Wireless Charger', description: '3-in-1 wireless charging station for iPhone, Apple Watch, and AirPods. 15W fast charging with alignment magnets.', price: 9999, originalPrice: 12999, discount: 23, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop', category: 'Accessories', brand: 'Belkin', stock: 35, rating: 4.5, numReviews: 456 },
  
  // ===== MORE HOME & LIFESTYLE =====
  { name: 'iRobot Roomba j7+', description: 'Robot vacuum with PrecisionVision Navigation, self-emptying base, and smart mapping. Avoids obstacles intelligently.', price: 54999, originalPrice: 64999, discount: 15, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&h=500&fit=crop', category: 'Home & Lifestyle', brand: 'iRobot', stock: 10, rating: 4.6, numReviews: 234 },
  { name: 'Philips Hue Starter Kit', description: 'Smart lighting kit with 3 color bulbs, bridge, and dimmer switch. 16 million colors, voice control compatible.', price: 14999, originalPrice: 17999, discount: 17, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop', category: 'Home & Lifestyle', brand: 'Philips', stock: 25, rating: 4.7, numReviews: 567 },
  
  // ===== MORE FASHION =====
  { name: 'Ray-Ban Aviator Classic', description: 'Iconic aviator sunglasses with gold frame, green G-15 lenses, and crystal lenses. Timeless style since 1937.', price: 8999, originalPrice: 10999, discount: 18, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop', category: 'Fashion', brand: 'Ray-Ban', stock: 40, rating: 4.8, numReviews: 892 },
  { name: 'Levi\'s 511 Slim Jeans', description: 'Classic slim fit jeans with stretch for comfort. Sits below waist, slim through thigh, narrow leg opening.', price: 2999, originalPrice: 3999, discount: 25, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop', category: 'Fashion', brand: 'Levi\'s', stock: 60, rating: 4.5, numReviews: 1234 },
  
  // ===== MORE CAMERAS =====
  { name: 'Fujifilm X-T5', description: '40MP X-Trans CMOS 5 HR sensor, 6.2K video, film simulation modes, and classic retro design. Photography art.', price: 159999, originalPrice: 174999, discount: 9, image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop', category: 'Cameras', brand: 'Fujifilm', stock: 10, rating: 4.8, numReviews: 189 }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Product.deleteMany({});
    console.log('Old products cleared');

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedProducts();
