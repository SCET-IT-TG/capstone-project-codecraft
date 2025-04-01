import React from 'react';
import ProductList from './ProductList';
import logo from './logo.jpg';
import './Home.css';

function Home() {
  return (
    <div className='container'>
      <h1><img src={logo} className='logo' alt="Logo" /> ShopSphere
      E-commerce App</h1>
      <ProductList />
      <footer>
        <p>© 2025 E-commerce App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;