import React, { useEffect, useState } from 'react';
import { fetchAllDrivers } from '../api/ClientApi'; // your API helper file

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllDrivers()
      .then(data => {
        setDrivers(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch drivers');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading drivers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Drivers</h2>
      <ul>
        {drivers.map(driver => (
          <li key={driver.id}>
            {driver.name} - {driver.phone} - Bus ID: {driver.bus_id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverList;
