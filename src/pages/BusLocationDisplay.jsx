import { useState, useEffect } from 'react';
import { fetchBusLocation } from '../api/ClientApi'; // adjust path as needed
import BusMap from './BusMaps';

const BusLocationDisplay = () => {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const data = await fetchBusLocation("BUS001");
        setLocation({ lat: data.latitude, lng: data.longitude });
      } catch (err) {
        console.error('Failed to fetch location', err);
      }
    };

    fetchLocation(); // initial fetch
    const interval = setInterval(fetchLocation, 5000); // fetch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return <BusMap lat={location.lat} lng={location.lng} />;
};

export default BusLocationDisplay;
