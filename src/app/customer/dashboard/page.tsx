"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const moment = require("moment");

import "./page.css";

const CustomerDashboard = () => {
  const router = useRouter();
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [salons, setSalons] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedSalonId, setSelectedSalonId] = useState("");
  const [selectedStylistId, setSelectedStylistId] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [activeHours, setActiveHours] = useState({ openingTime: "", closingTime: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/customer/login");
    } else {
      fetchCustomerData();
      fetchSalons();
    }
  }, []);

  const fetchCustomerData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/customers/dashboard", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCustomerData(data);
      } else {
        setError("Failed to fetch customer data.");
        localStorage.removeItem("token");
        router.push("/customer/login");
      }
    } catch (err) {
      setError("Something went wrong.");
      console.error("Error fetching customer data:", err);
    }
  };

  const fetchSalons = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/salons");
      const data = await response.json();
      setSalons(data);
    } catch (error) {
      console.error("Error fetching salons:", error);
    }
  };

  const fetchStylists = async (salonId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${salonId}/stylists`);
      if (response.ok) {
        const data = await response.json();
        console.log("Stylists fetched:", data); // Log for debugging
        setStylists(data);
      } else {
        throw new Error(`Failed to fetch stylists for salon ID: ${salonId}`);
      }
    } catch (error) {
      setStylists([]);
      console.error("Error fetching stylists:", error);
    }
  };
  

  const fetchServices = async (salonId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${salonId}/services`);
      if (response.ok) {
        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
      } else {
        throw new Error("Failed to fetch services");
      }
    } catch (error) {
      setServices([]);
      console.error("Error fetching services:", error);
    }
  };

  



  const handleSalonChange = async (e) => {
    const salonId = e.target.value;
    setSelectedSalonId(salonId);
    setSelectedStylistId("");
    setSelectedServiceIds([]);
    fetchStylists(salonId);
    fetchServices(salonId);

    const selectedSalon = salons.find((salon) => salon._id === salonId);
    if (selectedSalon) {
      setActiveHours({
        openingTime: selectedSalon.openingTime,
        closingTime: selectedSalon.closingTime,
      });
    }
  };

  const handleServiceSelect = (serviceId) => {
    if (!selectedServiceIds.includes(serviceId)) {
      setSelectedServiceIds([...selectedServiceIds, serviceId]);
    }
  };

  const handleServiceRemove = (serviceId) => {
    setSelectedServiceIds(selectedServiceIds.filter((id) => id !== serviceId));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedSalonId || !selectedStylistId || selectedServiceIds.length === 0 || !appointmentDate || !appointmentTime) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const selectedServices = services.filter((service) => selectedServiceIds.includes(service._id));

      const totalDurationInMinutes = selectedServices.reduce((total, service) => {
        const duration = parseInt(service.time.replace(" mins", ""), 10);
        return total + duration;
      }, 0);

      const formattedDate = moment(appointmentDate, "YYYY-MM-DD").format("YYYY-MM-DD");
      const formattedTime = moment(appointmentTime, ["hh:mm A", "HH:mm"]).format("hh:mm A");

      const appointmentData = {
        salonId: selectedSalonId,
        stylistId: selectedStylistId,
        services: selectedServices.map((service) => ({
          serviceId: service._id,
          name: service.name,
          duration: parseInt(service.time.replace(" mins", ""), 10),
        })),
        appointmentDate: formattedDate,
        time: formattedTime,
        totalServiceDuration: totalDurationInMinutes,
        customerId: customerData ? customerData._id : null,
        customerName: customerData ? customerData.name : "",
        customerPhone: customerData ? customerData.phoneNumber : "",
      };

      setLoading(true);

      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage("Appointment successfully booked!");
        setErrorMessage("");
        console.log("Appointment created:", result);
      } else {
        const errorData = await response.json();
        if (response.status === 400 && errorData.nextAvailableTime) {
          setErrorMessage(
            `Failed to create appointment: ${errorData.message}. You can book an appointment for ${errorData.nextAvailableTime}.`
          );
        } else {
          setErrorMessage(`Failed to create appointment: ${errorData.message || "An unexpected error occurred"}`);
        }
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      setErrorMessage("An unexpected error occurred while booking the appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {customerData ? (
        <>
          <h1>Welcome, {customerData.name}!</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="salon">Select Salon:</label>
              <select id="salon" value={selectedSalonId} onChange={handleSalonChange}>
                <option value="">-- Select Salon --</option>
                {salons.map((salon) => (
                  <option key={salon._id} value={salon._id}>
                    {salon.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
  <label htmlFor="stylist">Select Stylist:</label>
  <select
    id="stylist"
    value={selectedStylistId}
    onChange={(e) => setSelectedStylistId(e.target.value)}
  >
    <option value="">-- Select Stylist --</option>
    {stylists.map((stylist) => (
      <option key={stylist._id} value={stylist._id}>
        {stylist.name}
      </option>
    ))}
  </select>
  {selectedStylistId && (
    <div>
      <h3>Selected Stylist:</h3>
      {stylists
        .filter((stylist) => stylist._id === selectedStylistId)
        .map((stylist) => (
          <div key={stylist._id}>
            <p>{stylist.name}</p>
            {stylist.image && <img src={stylist.image} alt={stylist.name} width="50" height="50" />}
          </div>
        ))}
    </div>
  )}
</div>



            <div>
              <label htmlFor="services">Select Services:</label>
              <div className="services-selection">
                <select
                  id="services"
                  onChange={(e) => handleServiceSelect(e.target.value)}
                  value=""
                >
                  <option value="">-- Select a Service --</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name} - {service.time}
                    </option>
                  ))}
                </select>
                <div className="selected-services">
                  {selectedServiceIds.map((id) => {
                    const service = services.find((service) => service._id === id);
                    return (
                      <div key={id} className="service-chip">
                        {service.name}{" "}
                        <button type="button" onClick={() => handleServiceRemove(id)}>
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="appointmentDate">Select Date:</label>
              <input type="date" id="appointmentDate" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
            </div>

            <div>
              <label htmlFor="appointmentTime">Select Time:</label>
              <input type="time" id="appointmentTime" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </form>
          {successMessage && <p className="success">{successMessage}</p>}
          {error && <p className="error">{error}</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CustomerDashboard;
