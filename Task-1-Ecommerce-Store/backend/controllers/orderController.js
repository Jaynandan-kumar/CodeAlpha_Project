const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Place order from cart
// @route   POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Validate shipping address
    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    const { fullName, address, city, postalCode, country, phone } = shippingAddress;
    
    if (!fullName || !address || !city || !postalCode || !country || !phone) {
      return res.status(400).json({ message: 'All shipping address fields are required' });
    }

    // Validate string lengths
    if (fullName.length > 100) {
      return res.status(400).json({ message: 'Full name is too long' });
    }
    if (address.length > 200) {
      return res.status(400).json({ message: 'Address is too long' });
    }
    if (city.length > 100) {
      return res.status(400).json({ message: 'City name is too long' });
    }
    if (postalCode.length > 20) {
      return res.status(400).json({ message: 'Postal code is too long' });
    }
    if (phone.length > 20) {
      return res.status(400).json({ message: 'Phone number is too long' });
    }

    // Validate payment method
    const validPaymentMethods = ['COD', 'UPI', 'GPAY', 'PHONEPE', 'PAYTM', 'CARD'];
    if (paymentMethod && !validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method. Allowed: COD, UPI, GPAY, PHONEPE, PAYTM, CARD' });
    }

    // Get user's cart with populated product data
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // CRITICAL SECURITY: Verify stock and calculate prices from database
    // Never trust frontend prices
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = item.product;
      
      if (!product) {
        return res.status(400).json({ message: 'One or more products no longer exist' });
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Only ${product.stock} available.` 
        });
      }

      // Use price from database (not from cart snapshot)
      const currentPrice = product.price;
      const itemTotal = currentPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        name: product.name,
        quantity: item.quantity,
        price: currentPrice, // Price snapshot from database
        product: product._id,
        image: product.image,
      });
    }

    // Calculate shipping and total on backend
    const shipping = subtotal >= 5000 ? 0 : 199;
    const totalPrice = subtotal + shipping;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress: {
        fullName: fullName.trim(),
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
        phone: phone.trim(),
      },
      paymentMethod: paymentMethod || 'COD',
      totalPrice,
      status: 'Pending',
      isPaid: paymentMethod !== 'COD',
    });

    // CRITICAL: Decrease stock for each product
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('PlaceOrder error:', error.message);
    res.status(500).json({ message: 'Failed to place order' });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    // Only return orders for the authenticated user
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('GetMyOrders error:', error.message);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // CRITICAL: Ownership check - user can only view their own orders
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('GetOrderById error:', error.message);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById };
