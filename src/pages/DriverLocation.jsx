import { useEffect } from 'react';
import { updateLocation } from '../api/ClientApi';

const DriverLocation = () => {
  const busId = "BUS001";

  useEffect(() => {
    const sendLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          updateLocation({ bus_id: busId, latitude, longitude })
            .catch(err => console.error('Location update failed:', err));
        },
        (err) => console.error('Geolocation error:', err),
        { enableHighAccuracy: true }
      );
    };

    const interval = setInterval(sendLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default DriverLocation;
