"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CustomerDashboard = () => {
  const router = useRouter();
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState('');
  const [salons, setSalons] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedSalonId, setSelectedSalonId] = useState('');
  const [selectedStylistId, setSelectedStylistId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/customer/login');
    } else {
      fetchCustomerData();
      fetchSalons();
    }
  }, []);

  // Fetch customer data and salons from backend
  const fetchCustomerData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/customers/dashboard', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCustomerData(data);
      } else {
        setError('Failed to fetch customer data.');
        localStorage.removeItem('token');
        router.push('/customer/login');
      }
    } catch (err) {
      setError('Something went wrong.');
      console.error('Error fetching customer data:', err);
    }
  };

  const fetchSalons = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/salons');
      const data = await response.json();
      setSalons(data);
    } catch (error) {
      console.error('Error fetching salons:', error);
    }
  };

  const fetchStylists = async (salonId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${salonId}/stylists`);
      if (response.ok) {
        const data = await response.json();
        setStylists(data);
      } else {
        throw new Error(`Failed to fetch stylists for salon ID: ${salonId}`);
      }
    } catch (error) {
      setStylists([]);
      console.error('Error fetching stylists:', error);
    }
  };

  const fetchServices = async (salonId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${salonId}/services`);
      if (response.ok) {
        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
      } else {
        throw new Error('Failed to fetch services');
      }
    } catch (error) {
      setServices([]);
      console.error('Error fetching services:', error);
    }
  };

  const handleSalonChange = (e) => {
    const salonId = e.target.value;
    setSelectedSalonId(salonId);
    setSelectedStylistId(''); // Reset stylist
    setSelectedServiceId(''); // Reset service
    fetchStylists(salonId);
    fetchServices(salonId);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Ensure appointmentDate is set correctly as a date string
    const appointmentData = {
      salonId: selectedSalonId,
      stylistId: selectedStylistId, // Optional field; can be omitted if not assigned
      serviceId: selectedServiceId,
      appointmentDate: new Date(`${appointmentDate}T${appointmentTime}`), // Ensure this is a Date object
      time: appointmentTime, // Include time in the request
      customerId: customerData ? customerData._id : null,
      customerName: customerData ? customerData.name : '', // Extracting customer name
      customerPhone: customerData ? customerData.phoneNumber : '', // Extracting customer phone
    };
  
    // Check for required fields
    if (!appointmentData.customerId || !appointmentData.customerName || !appointmentData.customerPhone || !appointmentData.time) {
      setError('Customer ID, name, phone, and time are required for booking an appointment.');
      return;
    }
  
    console.log('Appointment Data:', appointmentData); // Log the data being sent
  
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Appointment created:', result);
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to create appointment: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during appointment booking:', error);
      setError(error.message);
    }
  };
  
  
  

  return (
    <div className="dashboard-container">
      {customerData ? (
        <>
          <h1>Welcome, {customerData.name}!</h1>
          <div className="dashboard-details">
            <p>Email: {customerData.email}</p>
            <p>Phone: {customerData.phoneNumber}</p>
          </div>

          <h2>Book Appointment</h2>
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
              <select id="stylist" value={selectedStylistId} onChange={(e) => setSelectedStylistId(e.target.value)}>
                <option value="">-- Select Stylist --</option>
                {stylists.map((stylist) => (
                  <option key={stylist._id} value={stylist._id}>
                    {stylist.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="service">Select Service:</label>
              <select id="service" value={selectedServiceId} onChange={(e) => setSelectedServiceId(e.target.value)}>
                <option value="">-- Select Service --</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="appointmentDate">Appointment Date:</label>
              <input 
                type="date" 
                id="appointmentDate" 
                value={appointmentDate} 
                onChange={(e) => setAppointmentDate(e.target.value)} 
              />
            </div>

            <div>
              <label htmlFor="appointmentTime">Appointment Time:</label>
              <input 
                type="time" 
                id="appointmentTime" 
                value={appointmentTime} 
                onChange={(e) => setAppointmentTime(e.target.value)} 
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit">Book Appointment</button>
          </form>
        </>
      ) : (
        <p>Loading customer data...</p>
      )}
    </div>
  );
};

export default CustomerDashboard;
