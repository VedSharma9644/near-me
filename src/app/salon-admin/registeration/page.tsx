"use client";
import React, { useState } from 'react';
import "./page.css";

const Register = () => {
  const [salonName, setSalonName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [numberOfStylists, setNumberOfStylists] = useState(0);
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [numberOfServices, setNumberOfServices] = useState(0);
  const [services, setServices] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleServicesChange = (index: number, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = value;
    setServices(updatedServices);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      salonName,
      ownerName,
      numberOfStylists,
      openingTime,
      closingTime,
      services,
      username,
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/salons", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Salon registered successfully:", data);
        // Handle success (e.g., show a success message or redirect)
      } else {
        console.error("Failed to register salon");
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Salon Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Salon Name:</label>
          <input
            type="text"
            value={salonName}
            onChange={(e) => setSalonName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Owner Name:</label>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Number of Stylists:</label>
          <input
            type="number"
            value={numberOfStylists}
            onChange={(e) => setNumberOfStylists(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Opening Time:</label>
          <input
            type="time"
            value={openingTime}
            onChange={(e) => setOpeningTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Closing Time:</label>
          <input
            type="time"
            value={closingTime}
            onChange={(e) => setClosingTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Number of Services:</label>
          <input
            type="number"
            value={numberOfServices}
            onChange={(e) => {
              const value = Number(e.target.value);
              setNumberOfServices(value);
              setServices(new Array(value).fill('')); // Initialize service array
            }}
            required
          />
        </div>
        {Array.from({ length: numberOfServices }, (_, index) => (
          <div key={index}>
            <label>Service {index + 1}:</label>
            <input
              type="text"
              value={services[index] || ''}
              onChange={(e) => handleServicesChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit">Register Salon</button>
      </form>
    </div>
  );
};

export default Register;
