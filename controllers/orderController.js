import Order from '../models/Order.js';

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products');
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const order = await newOrder.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};