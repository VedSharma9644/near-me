"use client";
import React, { useState } from 'react';
import "./page.css";
import { useRouter } from 'next/navigation';

const SalonLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginData = { email, password };
        setLoading(true); // Set loading to true
    
        try {
            console.log('Logging in with:', loginData); // Log for debugging
            const response = await fetch('http://localhost:5000/api/login/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });
    
            console.log('Response:', response); // Check response status and headers
    
            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data); // Log the entire response
                console.log('Salon ownerName:', data.salon.ownerName); // Log the ownerName specifically
                console.log('Salon ID:', data.salon.id); // Log the Salon ID specifically
                
                localStorage.setItem('token', data.token); // Ensure token is stored
                localStorage.setItem('ownerName', data.salon.ownerName); // Store owner's name
                localStorage.setItem('Salon Id', data.salon.id); // Store owner's name
                console.log('Token stored:', localStorage.getItem('token')); // Log stored token
                router.push('/salon-admin/dashboard'); // Redirect on successful login
            } else {
                const errorData = await response.json();
                console.log("Error response from server:", errorData);
                setError(errorData.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('An error occurred, please try again later.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };
    
    
    return (
        <div>
            <h2>Salon Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default SalonLogin;
