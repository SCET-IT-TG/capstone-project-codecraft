import Product from '../models/Product.js';
import multer from 'multer';
import path from 'path';

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addProduct = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { name, price, quantity, category } = req.body;
      const image = req.file.filename;
      const newProduct = new Product({ name, price, quantity, image, category });
      const product = await newProduct.save();
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
];