import express from 'express';
import multer from 'multer';
import Product from '../models/Product.js';

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Get all products route
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Update product route
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product fields
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.quantity = req.body.quantity || product.quantity;
    product.category = req.body.category || product.category;

    // Update image if a new one is uploaded
    if (req.file) {
      product.image = req.file.filename;
    }

    const updatedProduct = await product.save();
    res.json({ product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// Delete product route
router.delete('/delete/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

export default router;