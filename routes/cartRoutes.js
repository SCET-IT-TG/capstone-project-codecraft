import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = express.Router();

// Add product to cart
router.post('/add', async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const order = await Order.findOne({ userId });
    if (order) {
      // Add product to existing order
      order.products.push(product);
      await order.save();
    } else {
      // Create a new order
      const newOrder = new Order({
        userId,
        products: [product],
      });
      await newOrder.save();
    }

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to cart', error });
  }
});

// Get cart items for a user
router.get('/:userId', async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req.params.userId }).populate('products');
    if (!order) {
      return res.status(404).json({ message: 'Cart is empty' });
    }
    res.json(order.products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart items', error });
  }
});

// Payment route
router.post('/payment', async (req, res) => {
  const { userId } = req.body;

  try {
    const order = await Order.findOne({ userId });
    if (!order) {
      return res.status(404).json({ message: 'No items in cart to process payment' });
    }

    await Order.deleteOne({ userId });

    res.status(200).json({ message: 'Payment successful. Thank you for your order!' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error });
  }
});

export default router;