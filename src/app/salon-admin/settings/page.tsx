"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './page.css'; // Add your CSS for styling

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    openingTime: '',
    closingTime: '',
    stylists: [{ name: '', image: '' }],
    services: [{ name: '', time: '', price: '' }]
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch the settings when the component loads
  useEffect(() => {
    axios.get('http://localhost:5000/api/salon/settings', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setSettings(response.data); // Set the fetched settings
      })
      .catch(error => {
        console.error('Error fetching settings:', error);
      });
  }, []);
  
  // Handle input changes when editing settings
  const handleChange = (type, index, field, value) => {
    const updatedList = [...settings[type]];
    
    // Ensure the field exists before attempting to assign the value
    if (updatedList[index]) {
      updatedList[index][field] = value;
      setSettings(prevState => ({ ...prevState, [type]: updatedList }));
    } else {
      console.error(`Error: ${type} at index ${index} is undefined`);
    }
  };

  // Add new service
  const addService = () => {
    const newService = { name: '', time: '', price: '' }; // Default values
    setSettings(prevState => ({
      ...prevState,
      services: [...prevState.services, newService],
    }));
  };

  // Add new stylist
  const addStylist = () => {
    const newStylist = { name: '', image: '' }; // Initialize with empty values
    setSettings(prevState => ({
      ...prevState,
      stylists: [...prevState.stylists, newStylist],
    }));
  };

   // Delete service
   const deleteService = (index) => {
    const updatedServices = settings.services.filter((_, i) => i !== index);
    setSettings(prevState => ({ ...prevState, services: updatedServices }));
  };

  // Delete stylist
  const deleteStylist = (index) => {
    const updatedStylists = settings.stylists.filter((_, i) => i !== index);
    setSettings(prevState => ({ ...prevState, stylists: updatedStylists }));
  };




  
  // Enable editing mode
  const enableEditing = () => {
    setIsEditing(true);
  };

  // Save updated settings
  const saveSettings = () => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    axios.put('http://localhost:5000/api/salon/settings', settings, {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the headers
      }
    })
      .then(response => {
        setSettings(response.data); // Update the local state with the new data
        setIsEditing(false); // Disable editing mode
      })
      .catch(error => {
        console.error('Error saving settings:', error);
      });
  };

  return (
    <div className="settings-page">
      <h2>Salon Settings</h2>

      <div>
        <h4>Opening Time</h4>
        <input
          type="text"
          value={settings.openingTime}
          disabled={!isEditing}
          onChange={(e) => setSettings({ ...settings, openingTime: e.target.value })}
        />
      </div>

      <div>
        <h4>Closing Time</h4>
        <input
          type="text"
          value={settings.closingTime}
          disabled={!isEditing}
          onChange={(e) => setSettings({ ...settings, closingTime: e.target.value })}
        />
      </div>
      
      {/* Service JSX */}
      {settings.services.map((service, index) => (
        <div key={index}>
          <label>Service Name:</label>
          <input
            type="text"
            value={service.name}
            onChange={e => handleChange('services', index, 'name', e.target.value)}
            disabled={!isEditing}
          />
          <label>Time:</label>
          <input
            type="text"
            value={service.time}
            onChange={e => handleChange('services', index, 'time', e.target.value)}
            disabled={!isEditing}
          />
          <label>Price:</label>
          <input
            type="text"
            value={service.price}
            onChange={e => handleChange('services', index, 'price', e.target.value)}
            disabled={!isEditing}
          />
          {/* Delete button for service */}
          {isEditing && (
            <button onClick={() => deleteService(index)}>Delete Service</button>
          )}
        </div>
      ))}
<div>       {isEditing && (
        <>
          <button onClick={addService}>Add Service</button>
        </>
      )}
</div>
      {/* Stylists JSX */}
      <h2>Stylists</h2>
      {settings.stylists.map((stylist, index) => (
        <div key={index}>
          <label>Stylist Name:</label>
          <input
            type="text"
            value={stylist.name}
            onChange={e => handleChange('stylists', index, 'name', e.target.value)}
            disabled={!isEditing}
          />
          <label>Image URL:</label>
          <input
            type="text"
            value={stylist.image}
            onChange={e => handleChange('stylists', index, 'image', e.target.value)}
            disabled={!isEditing}
          />
           {/* Delete button for stylist */}
           {isEditing && (
            <button onClick={() => deleteStylist(index)}>Delete Stylist</button>
          )}
        </div>
      ))}
       <div>{isEditing && (
        <>
          <button onClick={addStylist}>Add Stylist</button>
          
        </>
      )}</div>

     

      {!isEditing ? (
        <button onClick={enableEditing}>Edit Settings</button>
      ) : (
        <button onClick={saveSettings}>Save Settings</button>
      )}
    </div>
  );
};

export default SettingsPage;
