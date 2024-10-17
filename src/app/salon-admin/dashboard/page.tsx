"use client";
import React, { useEffect, useState } from "react";
import Header from "../header/page"; // Corrected the import for Header
import "./page.css"; // Styles for the dashboard
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [userData, setUserData] = useState(null); // State to store user data

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/salon-admin/login");
    } else {
      setIsAuthenticated(true);
      fetchUserData(token); // Fetch user data if authenticated
    }
    setLoading(false); // Set loading to false after checking
  }, [router]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/salonAdmin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token for authentication
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserData(data); // Set the user data in state
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle error state if necessary
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  return (
    <div className="dashboard">
      <Header />

      <div className="dashboard-content">
        {userData && (
          <div>
            <h1>Welcome, {userData.name}</h1>
            <h2>Your Salon: {userData.salonName}</h2>
            {/* Add more user-related information as needed */}
          </div>
        )}
        <button
          className="dashboard-button"
          onClick={() => router.push("/salon-admin/appointments")}
        >
          Appointment Checker
        </button>
        <button
          className="dashboard-button"
          onClick={() => router.push("/salon-admin/stylists")}
        >
          Stylist Management
        </button>
        <button
          className="dashboard-button"
          onClick={() => router.push("/salon-admin/settings")}
        >
          Settings
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
