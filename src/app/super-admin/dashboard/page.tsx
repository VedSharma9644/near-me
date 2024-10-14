"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext"; // Adjust path accordingly
import Header from "@/components/header";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { state } = useAuth(); // Access auth state
  const [salons, setSalons] = useState([]); // State to hold salon data
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    if (state.isLoading) {
      // Wait for loading to complete
      return;
    }

    if (!state.isAuthenticated) {
      // If not authenticated, redirect to login
      router.push("/super-admin/login");
    } else {
      fetchSalons(); // Fetch salon data when authenticated
    }
  }, [state.isLoading, state.isAuthenticated, router]);

  const fetchSalons = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/salons");
      if (!response.ok) {
        throw new Error("Failed to fetch salons");
      }
      const data = await response.json();
      setSalons(data);
    } catch (error) {
      console.error("Error fetching salons:", error);
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };

  if (loading) {
    // Loading state
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <Header />
      <h1 className="text-xl font-bold">Super Admin Dashboard</h1>
      <table className="min-w-full border-collapse border border-gray-200 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-200 p-2">ID</th>
            <th className="border border-gray-200 p-2">Salon Name</th>
            <th className="border border-gray-200 p-2">Owner Name</th>
            <th className="border border-gray-200 p-2">Address</th>
            <th className="border border-gray-200 p-2">Full Details</th>
          </tr>
        </thead>
        <tbody>
          {salons.map((salon, index) => (
            <tr key={salon._id}>
              <td className="border border-gray-200 p-2">{index + 1}</td>
              <td className="border border-gray-200 p-2">{salon.name}</td>
              <td className="border border-gray-200 p-2">{salon.ownerName}</td>
              <td className="border border-gray-200 p-2">{salon.address}</td>
              <td className="border border-gray-200 p-2">
                <button 
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => router.push(`/super-admin/salon-details/${salon._id}`)} // Navigate to salon details page
                >
                  Full Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
