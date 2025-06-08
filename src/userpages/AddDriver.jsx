import React, { useState } from 'react';
import { createDriver } from '../api/ClientApi';

const AddDriverForm = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    license_no: '',
    bus_id: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await createDriver(formData);
      setMessage(res.message || 'Driver added successfully');
      setFormData({ id: '', name: '', phone: '', license_no: '', bus_id: '' });
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error adding driver');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="id" value={formData.id} onChange={handleChange} placeholder="Driver ID" required />
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
      <input name="license_no" value={formData.license_no} onChange={handleChange} placeholder="License No" required />
      <input name="bus_id" value={formData.bus_id} onChange={handleChange} placeholder="Bus ID" required />
      <button type="submit">Add Driver</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default AddDriverForm;
