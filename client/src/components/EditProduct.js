import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: '',
    image: null
  });

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/api/products/${id}`)
      .then(response => {
        const product = response.data;
        setFormData({
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          category: product.category,
          image: null
        });
      })
      .catch(error => console.error('Error fetching product:', error));
  }, [id]);

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

    axios.put(`http://127.0.0.1:5000/api/products/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        console.log('Product updated:', response.data);
        navigate('/products');
      })
      .catch(error => console.error('Error updating product:', error));
  };

  return (
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
        <button type="button" onClick={() => navigate('/products')}>Cancel</button>
      </form>
    </div>
  );
}

export default EditProduct;