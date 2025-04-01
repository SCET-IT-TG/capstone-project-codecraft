import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAuthenticated = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized' });
  }
};