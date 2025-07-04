import React, { useEffect, useState } from "react";
import { fetchAllBuses } from "../api/ClientApi";

const BusList = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllBuses()
      .then((data) => {
        setBuses(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch buses");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading buses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Bus List</h2>
      <ul>
        {buses.map((bus) => (
          <li key={bus.id}>
            Bus No: {bus.bus_number}, Capacity: {bus.capacity || "N/A"}, Route: {bus.route_name || "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusList;
