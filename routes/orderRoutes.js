// import express from 'express';
// import { getOrders, addOrder } from '../controllers/orderController.js';
// import { protect } from '../middlewares/authMiddleware.js';
// const router = express.Router();

// router.get('/', protect, getOrders);
// router.post('/add', protect, addOrder);

// export default router;


// import express from 'express';
// import Order from '../models/Order.js';

// const router = express.Router();

// router.get('/', async (req, res) => {
//   const orders = await Order.find().populate('user').populate('products');
//   res.json(orders);
// });

// export default router;



import express from 'express';
import Order from '../models/Order.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a new order
router.post('/create', isAuthenticated, async (req, res) => {
  const { products, totalAmount, shippingAddress } = req.body;
  const userId = req.user.id;

  try {
    const order = new Order({
      user: userId,
      products,
      totalAmount,
      shippingAddress
    });
    await order.save();
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
});

// Get all orders for a user
router.get('/my-orders', isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// Get a specific order by ID
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
});

export default router;