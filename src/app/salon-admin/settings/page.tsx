"use client";
import React, { useState, useEffect } from "react";
import "./page.css"; // Styles for the settings page

const Settings = () => {
  // Example state for settings data
  const [openingTime, setOpeningTime] = useState("9:00 AM");
  const [closingTime, setClosingTime] = useState("9:00 PM");
  const [numberOfStylists, setNumberOfStylists] = useState(3);
  const [stylists, setStylists] = useState(["John Doe", "Jane Smith", "Emily Davis"]);
  const [numberOfServices, setNumberOfServices] = useState(5);
  const [services, setServices] = useState([
    { name: "Haircut", price: 20, time: "30 mins" },
    { name: "Shave", price: 15, time: "20 mins" },
    { name: "Manicure", price: 25, time: "40 mins" },
    { name: "Pedicure", price: 30, time: "45 mins" },
    { name: "Hair Coloring", price: 50, time: "90 mins" }
  ]);

  // State for salon images
  const [salonImages, setSalonImages] = useState([
    "/path-to-image1.jpg",
    "/path-to-image2.jpg"
  ]);

  return (
    <div className="settings">
      <h1>Salon Settings</h1>

      <div className="settings-section">
        <h2>Operating Hours</h2>
        <p>Opening Time: {openingTime}</p>
        <p>Closing Time: {closingTime}</p>
      </div>

      <div className="settings-section">
        <h2>Stylists</h2>
        <p>No. of Stylists: {numberOfStylists}</p>
        <ul>
          {stylists.map((stylist, index) => (
            <li key={index}>{stylist}</li>
          ))}
        </ul>
      </div>

      <div className="settings-section">
        <h2>Services</h2>
        <p>No. of Services: {numberOfServices}</p>
        <ul>
          {services.map((service, index) => (
            <li key={index}>
              <strong>{service.name}</strong> - ${service.price} ({service.time})
            </li>
          ))}
        </ul>
      </div>

      <div className="settings-section">
        <h2>Salon Images</h2>
        <div className="image-gallery">
          {salonImages.map((image, index) => (
            <img key={index} src={image} alt={`Salon image ${index + 1}`} className="salon-image" />
          ))}
        </div>
      </div>
      <div className="edit-settings"><button>Edit settings</button></div>
    </div>
  );
};

export default Settings;
