"use client"
// src/app/super-admin/salon-details/[id]/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "./page.css";

const SalonDetails = ({ params }) => {
    const router = useRouter();
    const { id } = params; // Get the ID from the params
    const [salon, setSalon] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSalonDetails = async () => {
            if (!id) return; // Ensure the ID is present

            try {
                const response = await fetch(`http://localhost:5000/api/salons/${id}`);
                if (!response.ok) throw new Error('Failed to fetch salon details');
                const data = await response.json();
                setSalon(data);
            } catch (error) {
                console.error('Error fetching salon details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSalonDetails();
    }, [id]);

    const handleEdit = () => {
        router.push(`/super-admin/salon-details/edit/${id}`); // Navigate to the edit page
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!salon) {
        return <div>No salon found.</div>;
    }

    return (
        <div className={"container"}>
            <h1 className={"title"}>{salon.name}</h1>
            <table className={"table"}>
                <tbody>
                    <tr>
                        <th>Owner</th>
                        <td>{salon.ownerName}</td>
                    </tr>
                    <tr>
                        <th>Number of Stylists</th>
                        <td>{salon.numberOfStylists}</td>
                    </tr>
                    <tr>
                        <th>Opening Time</th>
                        <td>{salon.openingTime}</td>
                    </tr>
                    <tr>
                        <th>Closing Time</th>
                        <td>{salon.closingTime}</td>
                    </tr>
                    <tr>
                        <th>Services</th>
                        <td>{salon.services.join(', ')}</td>
                    </tr>
                    <tr>
                        <th>Username</th>
                        <td>{salon.username}</td>
                    </tr>
                    <tr>
                        <th>Password</th>
                        <td>{salon.password}</td>
                    </tr>
                </tbody>
            </table>
            <button className="edit-button" onClick={handleEdit}>Edit</button>
        </div>
    );
};

export default SalonDetails;
