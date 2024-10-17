import React, { useEffect, useState } from 'react';
import "./page.css"; // Styles for the header
import { useRouter } from 'next/navigation';

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [ownerName, setOwnerName] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state
    const router = useRouter();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const fetchOwnerData = async () => {
        setLoading(true); // Set loading to true before the fetch
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            if (!token) {
                throw new Error('No token found');
            }

            const response = await fetch('http://localhost:5000/api/salonAdmin/dashboard', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Attach the token in the Authorization header
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch owner data: ' + response.status);
            }

            const data = await response.json();
            setOwnerName(data.ownerName); // Set owner name in the frontend
        } catch (error) {
            console.error('Error fetching owner data:', error);
        } finally {
            setLoading(false); // Set loading to false after the fetch is complete
        }
    };

    useEffect(() => {
        fetchOwnerData(); // Fetch owner data on component mount
    }, []);

    return (
        <div className="header">
            <h1 className="logo" onClick={() => router.push("/salon-admin/dashboard")}>
                Home
            </h1>
            <div className="settings-button">
                <button onClick={toggleDropdown}>
                    ☰
                </button>
                {dropdownOpen && (
                    <div className="dropdown">
                        <div className="profile">
                            <img src="/path-to-profile-image" alt="Profile" />
                            {loading ? ( // Show loading state
                                <p>Loading...</p>
                            ) : (
                                ownerName && <p>{ownerName}</p>
                            )}
                        </div>
                        <button onClick={() => router.push("/salon-admin/settings")}>
                            Settings
                        </button>
                        <button>Logout</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
