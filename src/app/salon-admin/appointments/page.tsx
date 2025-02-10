"use client";
import axios from 'axios';
import { decode } from 'jwt-decode';

import React, { useEffect, useState } from 'react';

const SalonAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [salonId, setSalonId] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Token not found in localStorage');

                const decodedToken = decode(token);

                const salonIdFromToken = decodedToken.id; // Adjust based on your token structure
                setSalonId(salonIdFromToken);

                const response = await axios.get(`/api/appointments/salon/${salonIdFromToken}`);
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Salon Appointments</h2>
            <table>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Stylist</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment._id}>
                            <td>{appointment.customerId?.name}</td>
                            <td>{appointment.serviceId?.name}</td>
                            <td>{appointment.stylistId?.name}</td>
                            <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                            <td>{appointment.time}</td>
                            <td>{appointment.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalonAppointments;
