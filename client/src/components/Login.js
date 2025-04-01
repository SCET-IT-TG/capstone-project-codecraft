import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './login.css';

function Login({ setIsAuthenticated, setUsername }) {
  const [username, setLocalUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:5000/api/auth/login', { username, password })
      .then(response => {
        const { token, userId } = response.data; // Extract token and userId from the response
        localStorage.setItem('token', token); // Save the token
        localStorage.setItem('userId', userId); // Save the userId
        setIsAuthenticated(true);
        const decodedToken = jwtDecode(token); // Decode the token
        setUsername(decodedToken.username); // Set the username
      })
      .catch(error => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials and try again.');
      });
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h1>Login Page</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setLocalUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;