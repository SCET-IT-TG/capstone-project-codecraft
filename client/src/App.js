import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import logo from './components/logo.jpg';
import Login from './components/Login';
import Register from './components/Register';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import './App.css';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <img src={logo} className="logo" alt="Logo" /> ShopSphere
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            {isAuthenticated ? (
              <>
                <li><span>Welcome, {username}</span></li>
                <li><Link to="/add-product">Add Product</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Sign Up</Link></li>
              </>
            )}
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-product" element={isAuthenticated ? <AddProduct /> : <Navigate to="/login" />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/edit-product/:id" element={isAuthenticated ? <EditProduct /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;