"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Adjusted import for Next.js 13
import "./page.css";

// Import the JSON data
import statesWithCities from "@/public/data/stateWithCities.json";

const Register = () => {
  const [salonName, setSalonName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerMobile, setOwnerMobile] = useState('');
  const [email, setEmail] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [password, setPassword] = useState('');
  const [cities, setCities] = useState([]); // State to hold available cities
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  const router = useRouter(); // Initialize useRouter

  // Effect to set cities based on selected state
  useEffect(() => {
    const stateData = statesWithCities.states.find(state => state.state === selectedState);
    setCities(stateData ? stateData.cities : []);
    setSelectedCity(''); // Reset selected city when state changes
  }, [selectedState]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      salonName,
      ownerName,
      ownerMobile,
      state: selectedState,
      city: selectedCity,
      area,
      pincode,
      email,
      password,
    };

    console.log("Submitting form data:", formData); // Log form data for debugging

    try {
      const response = await fetch("http://localhost:5000/api/salons/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Salon registered successfully:", data);
        setErrorMessage(''); // Clear any previous error messages

        // Redirect to the login page after successful registration
        router.push('/salon-admin/login'); // Adjust the path to your login page as necessary
      } else {
        const errorData = await response.json();
        console.error("Failed to register salon:", errorData); // Log error data for debugging
        if (errorData.message) {
          setErrorMessage(errorData.message); // Use the message from the backend if available
        } else {
          setErrorMessage('Failed to register salon. Please try again.');
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage('An unexpected error occurred. Please try again.');
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
          <label>Owner Mobile Number:</label>
          <input
            type="tel"
            value={ownerMobile}
            onChange={(e) => setOwnerMobile(e.target.value)}
            required
          />
        </div>
        <div>
          <label>State:</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            required
          >
            <option value="">Select State</option>
            {statesWithCities.states.map((state) => (
              <option key={state.state} value={state.state}>
                {state.state}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>City:</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            required
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Area:</label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Pincode:</label>
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email ID:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
        <button type="submit">Register Salon</button>
      </form>
    </div>
  );
};

export default Register;
