"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentForm = () => {
  const [appointmentTime, setAppointmentTime] = useState('');
  const [bookedTimes, setBookedTimes] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableStylists, setAvailableStylists] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState<string>('');

  useEffect(() => {
    if (selectedDate) {
      // Fetch the booked appointment times for the selected date
      axios
        .get(`/api/appointments?salonId=someSalonId&appointmentDate=${selectedDate}`)
        .then((response) => {
          const times = response.data.map((appointment) => appointment.time); // assuming time is stored in minutes or hours
          setBookedTimes(times);
        })
        .catch((error) => {
          console.error('Error fetching booked times:', error);
        });
    }

    // Fetch the list of stylists for the salon
    axios
      .get(`/api/stylists?salonId=someSalonId`)
      .then((response) => {
        setAvailableStylists(response.data);  // assuming response contains an array of stylists
      })
      .catch((error) => {
        console.error('Error fetching stylists:', error);
      });
  }, [selectedDate]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppointmentTime(e.target.value);
  };

  const handleStylistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStylist(e.target.value);
  };

  const isTimeDisabled = (time: string) => {
    return bookedTimes.includes(parseInt(time)); // Disable time if it's already booked
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const appointmentData = {
      salonId: 'someSalonId',
      appointmentDate: selectedDate,
      time: appointmentTime,
      stylistId: selectedStylist,
      // other form fields can be added here like customer details, services, etc.
    };

    try {
      const response = await axios.post('/api/appointments', appointmentData);
      console.log('Appointment booked:', response.data);
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="appointmentDate">Select Date:</label>
        <input
          type="date"
          id="appointmentDate"
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <div>
          <label htmlFor="appointmentTime">Select Time:</label>
          <input
            type="time"
            id="appointmentTime"
            value={appointmentTime}
            onChange={handleTimeChange}
            disabled={isTimeDisabled(appointmentTime)}
          />
          <p>Available time slots:</p>
          <select>
            {Array.from({ length: 24 }, (_, index) => {
              const hour = String(index).padStart(2, '0');
              const time = `${hour}:00`;
              return (
                <option key={time} value={time} disabled={isTimeDisabled(time)}>
                  {time}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label htmlFor="stylist">Select Stylist:</label>
          <select
            id="stylist"
            value={selectedStylist}
            onChange={handleStylistChange}
          >
            <option value="">-- Select Stylist --</option>
            {availableStylists.map((stylist: any) => (
              <option key={stylist._id} value={stylist._id}>
                {stylist.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
