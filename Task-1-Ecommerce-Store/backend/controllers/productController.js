const Product = require('../models/Product');

// @desc    Get all products with filters
// @route   GET /api/products?keyword=&category=&sort=
const getProducts = async (req, res) => {
  try {
    const { keyword, category, sort } = req.query;
    let query = {};

    // Search by keyword (case-insensitive regex)
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Sort
    let sortOption = { createdAt: -1 }; // default: newest
    switch (sort) {
      case 'price_low': sortOption = { price: 1 }; break;
      case 'price_high': sortOption = { price: -1 }; break;
      case 'rating': sortOption = { rating: -1 }; break;
      case 'newest': sortOption = { createdAt: -1 }; break;
    }

    const products = await Product.find(query).sort(sortOption);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a product (admin only)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct };
