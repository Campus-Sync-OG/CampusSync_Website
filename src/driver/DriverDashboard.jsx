import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

/* =======================
   STYLED COMPONENTS
======================= */

const Container = styled.div`
  min-height: 100vh;
  background-color: #f4f6fb;
  padding: 20px;
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #222;
  margin-bottom: 12px;
`;

const Label = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 6px;
`;

const Value = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #111;
`;

const Button = styled.button`
  background-color: ${(props) => (props.active ? "#ff4d4f" : "#4caf50")};
  padding: 14px;
  border-radius: 12px;
  border: none;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  margin-top: 12px;
  width: 200px;

  &:hover {
    opacity: 0.9;
  }
`;

/* =======================
   COMPONENT
======================= */

export default function DriverDashboard() {
  const [tripStarted, setTripStarted] = useState(false);
  const busId = "BUS001";

  // 🔹 Load status from localStorage on refresh
  useEffect(() => {
    const savedStatus = localStorage.getItem(`trip_started_${busId}`);
    if (savedStatus === "true") {
      setTripStarted(true);
    }
  }, []);

  useEffect(() => {
    let interval;

    if (tripStarted) {
      interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              await axios.post("http://localhost:3000/api/location/update", {
                bus_id: busId,
                latitude,
                longitude,
              });
            } catch (err) {
              console.error("Location update failed", err);
            }
          },
          (err) => console.error("GPS error", err),
          { enableHighAccuracy: true }
        );
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [tripStarted]);

  // 🔹 Toggle trip + store flag
  const toggleTrip = () => {
    const newStatus = !tripStarted;
    setTripStarted(newStatus);

    if (newStatus) {
      localStorage.setItem(`trip_started_${busId}`, "true");
    } else {
      localStorage.removeItem(`trip_started_${busId}`);
    }
  };

  return (
    <Container>
      <Title>🚍 Driver Dashboard</Title>

      <Card>
        <Label>Status</Label>
        <Value>{tripStarted ? "ON ROUTE" : "STOPPED"}</Value>

        <Button active={tripStarted} onClick={toggleTrip}>
          {tripStarted ? "Stop Trip" : "Start Trip"}
        </Button>
      </Card>
    </Container>
  );
}
