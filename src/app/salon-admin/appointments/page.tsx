"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

// Interface for Appointment type
interface Appointment {
  _id: string;
  customerName: string;
  serviceName: string;
  serviceDuration: string;
  servicePrice: string;
  stylistId: string;
  stylistName?: string; // Added
  stylistImage?: string; // Added
  appointmentDate: string;
  time: number; // Time is stored as a number (minutes)
  status: string;
}

// Function to convert time in minutes to 12-hour format with AM/PM
const convertMinutesToTime = (minutes: number) => {
    // Create a new Date object for the local time zone
    const date = new Date();
    // Set the hours and minutes from the input `minutes`
    date.setHours(0, minutes, 0, 0); // Set the time to the given minutes
  
    const hours = date.getHours();
    const minutesFormatted = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${(hours % 12 || 12)}:${minutesFormatted} ${period}`;
  
    return formattedTime;
  };
  

const SalonAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const salonId = localStorage.getItem("Salon Id");
        if (!salonId) {
          console.error("Salon ID not found in localStorage");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/appointments/salon/${salonId}`
        );

        const appointments = response.data.map((appointment: any) => ({
          ...appointment,
          serviceName: appointment.serviceDetails?.[0]?.serviceName || "N/A",
          serviceDuration: appointment.serviceDetails?.[0]?.serviceDuration || "N/A",
          servicePrice: appointment.serviceDetails?.[0]?.servicePrice || "N/A",
          stylistId: appointment.stylistId || "N/A",
          stylistName: appointment.stylistName || "Unknown", // Fetching stylist name
          stylistImage: appointment.stylistImage || "", // Fetching stylist image
          customerName: appointment.customerName || "N/A",
        }));

        setAppointments(appointments);
        console.log(appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading)
    return <p style={{ fontSize: "18px", fontWeight: "bold" }}>Fetching Appointments...</p>;

  return (
    <div>
    <h2>Salon Appointments</h2>
    <table>
      <thead>
        <tr>
          <th>Customer</th>
          <th>Service</th>
          <th>Stylist</th>
          <th>Stylist Image</th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((appointment) => (
          <tr key={appointment._id}>
            <td>{appointment.customerName && appointment.customerName.trim()}</td>
            <td>{appointment.serviceName && appointment.serviceName.trim()}</td>
            <td>{appointment.stylistName && appointment.stylistName.trim()}</td>
            <td>
              {appointment.stylistImage ? (
                <img
                  src={appointment.stylistImage}
                  alt="Stylist"
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
              ) : (
                <span>No Image</span>
              )}
            </td>
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
