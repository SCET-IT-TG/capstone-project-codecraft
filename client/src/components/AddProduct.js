import React, { useState } from 'react';
import axios from 'axios';

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    image: null,
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('quantity', formData.quantity);
    data.append('image', formData.image);
    data.append('category', formData.category);

    // Log the FormData content
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }

    axios.post('http://127.0.0.1:5000/api/products/add', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        console.log('Product added:', response.data);
        setFormData({
          name: '',
          price: '',
          quantity: '',
          image: null,
          category: ''
        });
      })
      .catch(error => {
        console.error('Error adding product:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      });
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <div>
          <label>Quantity:</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" name="image" onChange={handleFileChange} required />
        </div>
        <div>
          <label>Category:</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;