"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext"; // Adjust path accordingly
import Header from "@/components/header";

const SalonDetails = () => {
  const router = useRouter();
  const { state } = useAuth(); // Access auth state
  const [salon, setSalon] = useState(null); // State to hold salon data
  const [loading, setLoading] = useState(true); // State for loading

  // Get the salon ID from the URL
  const { id } = router.query;

  useEffect(() => {
    if (state.isLoading) {
      // Wait for loading to complete
      return;
    }

    if (!state.isAuthenticated) {
      // If not authenticated, redirect to login
      router.push("/super-admin/login");
    } else {
      fetchSalonDetails(); // Fetch salon details when authenticated
    }
  }, [state.isLoading, state.isAuthenticated, router]);

  const fetchSalonDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/salons/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch salon details");
      }
      const data = await response.json();
      setSalon(data);
    } catch (error) {
      console.error("Error fetching salon details:", error);
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };

  if (loading) {
    // Loading state
    return <div>Loading...</div>;
  }

  if (!salon) {
    return <div>No salon found.</div>; // Handle case where salon data is not found
  }

  return (
    <div className="flex flex-col items-center">
      <Header />
      <h1 className="text-xl font-bold">Salon Details</h1>
      <div>
        <p><strong>ID:</strong> {salon._id}</p>
        <p><strong>Salon Name:</strong> {salon.name}</p>
        <p><strong>Owner Name:</strong> {salon.ownerName}</p>
        <p><strong>Address:</strong> {salon.address}</p>
        <p><strong>Phone:</strong> {salon.phone}</p>
        <p><strong>Email:</strong> {salon.email}</p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
};

export default SalonDetails;
