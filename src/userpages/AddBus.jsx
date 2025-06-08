import React, { useState } from "react";
import { createBus } from "../api/ClientApi";

const AddBusForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    bus_number: "",
    capacity: "",
    route_name: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createBus(formData);
      setMessage(res.message || "Bus added successfully");
      setFormData({ id: "", bus_number: "", capacity: "", route_name: "" });
    } catch (err) {
      setMessage(err.response?.data?.error || "Error adding bus");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="id"
        value={formData.id}
        onChange={handleChange}
        placeholder="Bus ID"
        required
      />
      <input
        name="bus_number"
        value={formData.bus_number}
        onChange={handleChange}
        placeholder="Bus Number"
        required
      />
      <input
        name="capacity"
        type="number"
        value={formData.capacity}
        onChange={handleChange}
        placeholder="Capacity"
      />
      <input
        name="route_name"
        value={formData.route_name}
        onChange={handleChange}
        placeholder="Route Name"
      />
      <button type="submit">Add Bus</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default AddBusForm;
