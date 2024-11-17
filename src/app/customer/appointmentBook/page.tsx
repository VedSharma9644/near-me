"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentForm = () => {
  const [appointmentTime, setAppointmentTime] = useState('');
  const [bookedTimes, setBookedTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

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
  }, [selectedDate]);

  const handleTimeChange = (e) => {
    setAppointmentTime(e.target.value);
  };

  const isTimeDisabled = (time) => {
    return bookedTimes.includes(time); // Disable time if it's already booked
  };

  return (
    <div>
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
          {/* You can add logic to show available time slots */}
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
    </div>
  );
};

export default AppointmentForm;
