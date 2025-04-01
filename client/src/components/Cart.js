import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cart() {
  const [cart, setCart] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
    axios.get(`http://127.0.0.1:5000/api/cart/${userId}`)
      .then(response => setCart(response.data))
      .catch(error => console.error('Error fetching cart:', error));
  }, []);

  const handlePayment = () => {
    const userId = localStorage.getItem('userId');
    axios.post('http://127.0.0.1:5000/api/cart/payment', { userId })
      .then(response => {
        setPaymentMessage(response.data.message);
        setCart(null); // Clear the cart after payment
      })
      .catch(error => console.error('Error processing payment:', error));
  };

  if (!cart) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cart.products.map(item => (
          <li key={item.product._id}>
            {item.product.name} - ₹{item.product.price} x {item.quantity}
          </li>
        ))}
      </ul>
      <h3>Total: ₹{cart.totalAmount}</h3>
      <button onClick={handlePayment}>Make Payment</button>
      {paymentMessage && <p>{paymentMessage}</p>}
    </div>
  );
}

export default Cart;