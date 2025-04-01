import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();
const PORT = 5000;

// Ensure the uploads directory exists
const uploadDir = path.join(path.resolve(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerceDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});