import { useState, useEffect, useRef } from "react";
import { fetchBusLocation } from "../api/ClientApi";
import BusMap from "./BusMaps";

const BusLocationDisplay = () => {
  const [location, setLocation] = useState(null);
  const [tripActive, setTripActive] = useState(false);

  const lastLocationRef = useRef(null);
  const lastMoveTimeRef = useRef(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const data = await fetchBusLocation("BUS001");
        if (!data?.latitude || !data?.longitude) return;

        const newLoc = {
          lat: data.latitude,
          lng: data.longitude,
        };

        // 🧠 FIRST TIME
        if (!lastLocationRef.current) {
          lastLocationRef.current = newLoc;
          lastMoveTimeRef.current = Date.now();
          setTripActive(true);
          setLocation(newLoc);
          return;
        }

        const lastLoc = lastLocationRef.current;

        // 📍 CHECK IF BUS MOVED
        const moved =
          lastLoc.lat !== newLoc.lat || lastLoc.lng !== newLoc.lng;

        if (moved) {
          lastLocationRef.current = newLoc;
          lastMoveTimeRef.current = Date.now();
          setTripActive(true);
          setLocation(newLoc);
        }

        // ⏱️ IF NO MOVEMENT FOR 15 SECONDS → STOP TRIP
        if (Date.now() - lastMoveTimeRef.current > 15000) {
          setTripActive(false);
        }
      } catch (err) {
        console.error("Failed to fetch location", err);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🚫 HIDE MAP WHEN TRIP STOPPED
  if (!tripActive) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h3>🚌 Bus Tracking</h3>
        <p>Trip has not started yet</p>
      </div>
    );
  }

  // ✅ SHOW MAP ONLY WHEN BUS MOVES
  return <BusMap lat={location.lat} lng={location.lng} />;
};

export default BusLocationDisplay;
