"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import "./page.css"; // Styles for the registration

const CustomerRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  
  const [notification, setNotification] = useState(''); // State for notification message
  const router = useRouter(); // Initialize useRouter

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setNotification(''); // Clear notification on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/customers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get error details if available
        throw new Error(errorData.message || 'Registration failed');
      }

      // Handle successful registration
      setNotification('Registration successful!'); // Show success message

      // Redirect to the login page
      router.push('/customer/login'); // Update the path to your actual login page

    } catch (error) {
      console.error('Error during registration:', error.message || error);
      setNotification(error.message || 'An error occurred. Please try again.'); // Set error message
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        <button type="submit">Register</button>
      </form>

      {notification && <div className="notification">{notification}</div>} {/* Notification area */}
    </div>
  );
};

export default CustomerRegistration;
