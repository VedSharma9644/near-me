"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './page.css';

const CustomerLoginPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/customers/login', {
        emailOrPhone,
        password,
      });

      if (response.status === 200) {
        // Store token or any other user information if needed
        localStorage.setItem('token', response.data.token); // Adjust based on your API response
        // Redirect to the customer dashboard
        router.push('/customer/dashboard');
      }
    } catch (err: any) {
      // Handle errors (like invalid credentials)
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1>Customer Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email or Phone Number:</label>
          <input
            type="text"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default CustomerLoginPage;
