// src/app/customer/dashboard/page.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CustomerDashboard = () => {
  const router = useRouter();
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState('');

  // Fetch customer data from backend
  const fetchCustomerData = async () => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage

    if (!token) {
      // If no token, redirect to login page
      router.push('/customer/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/customers/dashboard', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Send token for authorization
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomerData(data);
      } else {
        setError('Failed to fetch customer data.');
        localStorage.removeItem('token'); // Remove invalid token
        router.push('/customer/login');
      }
    } catch (err) {
      setError('Something went wrong.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dashboard-container">
      {customerData ? (
        <>
          <h1>Welcome, {customerData.name}!</h1>
          <div className="dashboard-details">
            <p>Email: {customerData.email}</p>
            <p>Phone: {customerData.phoneNumber}</p>
            {/* You can add more customer-specific data here */}
          </div>
        </>
      ) : (
        <p>Loading your dashboard...</p>
      )}
    </div>
  );
};

export default CustomerDashboard;
