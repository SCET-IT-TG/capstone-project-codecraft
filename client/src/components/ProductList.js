import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Product.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: '',
    image: null,
  });

  // Fetch products and categories
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/products')
      .then(response => {
        setProducts(response.data);
        const uniqueCategories = [...new Set(response.data.map(product => product.category))];
        setCategories(uniqueCategories);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleAddToCart = (productId) => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
  
    console.log('User ID:', userId); // Debugging: Check if userId is being retrieved
    if (!userId) {
      alert('User is not logged in. Please log in to add products to the cart.');
      return;
    }
  
    axios.post('http://127.0.0.1:5000/api/cart/add', {
      userId,
      productId,
      quantity: 1, // Default quantity
    })
      .then(response => {
        alert('Product added to cart successfully!');
      })
      .catch(error => {
        console.error('Error adding product to cart:', error);
        alert('Failed to add product to cart. Please try again.');
      });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      image: null,
    });
  };

  const handleDeleteProduct = (productId) => {
    axios.delete(`http://127.0.0.1:5000/api/products/delete/${productId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        setProducts(products.filter(product => product._id !== productId));
        alert('Product deleted successfully!');
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      });
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('quantity', formData.quantity);
    data.append('category', formData.category);
    if (formData.image) {
      data.append('image', formData.image);
    }

    axios.put(`http://127.0.0.1:5000/api/products/update/${editingProduct._id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        setProducts(products.map(product => product._id === editingProduct._id ? response.data.product : product));
        setEditingProduct(null);
        setFormData({
          name: '',
          price: '',
          quantity: '',
          category: '',
          image: null,
        });
        alert('Product updated successfully!');
      })
      .catch(error => {
        console.error('Error updating product:', error);
        alert('Failed to update product. Please try again.');
      });
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <div className="product-container">
      <h2>Product List</h2>
      <div className="filter-section">
        <label>Filter by Category:</label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="product-list">
        {filteredProducts.map(product => (
          <div key={product._id} className="product-card">
            <img src={`http://127.0.0.1:5000/uploads/${product.image}`} alt={product.name} />
            <h3>{product.name}</h3>
            <p>Price: ₹{product.price}</p>
            <p>Quantity: {product.quantity}</p>
            <p>Category: {product.category}</p>
            <div className="product-actions">
              <button onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
              <button className="edit" onClick={() => handleEditProduct(product)}>Edit</button>
              <button className="delete" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {editingProduct && (
        <div className="edit-form">
          <h2>Edit Product</h2>
          <form onSubmit={handleFormSubmit}>
            <div>
              <label>Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleFormChange} required />
            </div>
            <div>
              <label>Price:</label>
              <input type="number" name="price" value={formData.price} onChange={handleFormChange} required />
            </div>
            <div>
              <label>Quantity:</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleFormChange} required />
            </div>
            <div>
              <label>Category:</label>
              <input type="text" name="category" value={formData.category} onChange={handleFormChange} required />
            </div>
            <div>
              <label>Image:</label>
              <input type="file" name="image" onChange={handleFormChange} />
            </div>
            <button type="submit">Update Product</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProductList;