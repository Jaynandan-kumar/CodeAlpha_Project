const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name image price brand stock');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    
    res.status(200).json(cart);
  } catch (error) {
    console.error('GetCart error:', error.message);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate productId
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    if (quantity > 99) {
      return res.status(400).json({ message: 'Cannot add more than 99 items at once' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock availability
    if (product.stock < 1) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      
      // Check if new quantity exceeds stock
      if (newQuantity > product.stock) {
        return res.status(400).json({ 
          message: `Only ${product.stock} items available in stock` 
        });
      }
      
      existingItem.quantity = newQuantity;
    } else {
      // Check if requested quantity exceeds stock
      if (quantity > product.stock) {
        return res.status(400).json({ 
          message: `Only ${product.stock} items available in stock` 
        });
      }

      cart.items.push({
        product: productId,
        quantity,
        price: product.price, // Price snapshot from database
      });
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product', 'name image price brand stock');
    res.status(200).json(populated);
  } catch (error) {
    console.error('AddToCart error:', error.message);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate inputs
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    if (quantity > 99) {
      return res.status(400).json({ message: 'Quantity cannot exceed 99' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Check stock availability
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ 
        message: `Only ${product.stock} items available in stock` 
      });
    }

    item.quantity = quantity;
    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.product', 'name image price brand stock');
    res.status(200).json(populated);
  } catch (error) {
    console.error('UpdateCartItem error:', error.message);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.product', 'name image price brand stock');
    res.status(200).json(populated);
  } catch (error) {
    console.error('RemoveFromCart error:', error.message);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
