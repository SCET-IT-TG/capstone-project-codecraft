import React, { useState } from 'react';
import axios from 'axios';

function UserAuth() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://127.0.0.1:5000/api/auth/login' : 'http://127.0.0.1:5000/api/auth/register';
    axios.post(url, formData)
      .then(response => {
        localStorage.setItem('token', response.data.token);
        console.log('User authenticated:', response.data);
      })
      .catch(error => console.error('Error authenticating user:', error));
  };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
    </div>
  );
}

export default UserAuth;