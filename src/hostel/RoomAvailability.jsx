import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getApprovedApplicationsForWarden,
  getHostelRooms,
  approveAndAssignRoom,
} from "../api/ClientApi";

/* ===================== STYLES ===================== */

const Container = styled.div`
  padding: 20px;
  background: #f5f7fb;
  min-height: 100vh;
`;

const Title = styled.h1`
  color: #002087;
  font-weight: 800;
`;

const Section = styled.div`
  margin-top: 30px;
`;

const Card = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  margin-bottom: 12px;
  cursor: pointer;
  border: 2px solid ${(p) => (p.$selected ? "#002087" : "#eee")};
`;

const RoomGrid = styled.div`
  display: flex;
  gap: 14px;
  overflow-x: auto;
`;

const RoomCard = styled.div`
  min-width: 160px;
  padding: 14px;
  border-radius: 14px;
  background: ${(p) => (p.$available ? "#e8f5e9" : "#ffe6ea")};
  border: 2px solid ${(p) => (p.$selected ? "#002087" : "#ddd")};
  cursor: ${(p) => (p.$available ? "pointer" : "not-allowed")};
  text-align: center;
  opacity: ${(p) => (p.$available ? 1 : 0.5)};
`;

const Button = styled.button`
  margin-top: 30px;
  padding: 14px;
  width: 220px;
  background: #002087;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    background: #aaa;
    cursor: not-allowed;
  }
`;

/* ===================== COMPONENT ===================== */

export default function RoomAvailability() {
  const [applications, setApplications] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  /* ===================== LOAD DATA ===================== */

  useEffect(() => {
    loadApproved();
    loadRooms();
  }, []);

  const loadApproved = async () => {
    const res = await getApprovedApplicationsForWarden();
    setApplications(Array.isArray(res) ? res : []);
  };

  const loadRooms = async () => {
    const res = await getHostelRooms();
    setRooms(Array.isArray(res) ? res : []);
  };

  /* ===================== ASSIGN ===================== */

  const handleAssign = async () => {
    if (!selectedRegistration || !selectedRoom) return;

    try {
      await approveAndAssignRoom({
        registration_id: selectedRegistration.registration_id,
        room_id: selectedRoom.room_id,
      });

      alert("✅ Room assigned successfully");

      setSelectedRegistration(null);
      setSelectedRoom(null);

      loadApproved();
      loadRooms();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to assign room");
    }
  };

  return (
    <Container>
      <Title>🏠 Hostel Room Allocation (Warden)</Title>

      {/* ===================== APPROVED APPLICATIONS ===================== */}
      <Section>
        <h3>Approved Hostel Applications</h3>

        {applications.length === 0 && <p>No approved applications</p>}

        {applications.map((app) => (
          <Card
            key={app.registration_id}
            $selected={
              selectedRegistration?.registration_id === app.registration_id
            }
            onClick={() => setSelectedRegistration(app)}
          >
            <strong>{app.student?.name || "Student"}</strong>
            <p>Admission No: {app.admission_no}</p>
            <p>Sharing: {app.preferred_sharing}</p>
          </Card>
        ))}
      </Section>

      {/* ===================== ROOMS ===================== */}
      <Section>
        <h3>Available Rooms</h3>

        <RoomGrid>
          {rooms.map((room) => {
            // ✅ SAFE availability calculation
            const availableBeds =
              room.available_beds ??
              room.capacity ??
              room.total_beds ??
              0;

            const available = availableBeds > 0;

            return (
              <RoomCard
                key={room.room_id}
                $available={available}
                $selected={selectedRoom?.room_id === room.room_id}
                onClick={() => {
                  if (!available) {
                    alert("No beds available in this room");
                    return;
                  }
                  setSelectedRoom(room);
                }}
              >
                <strong>Room {room.room_number}</strong>
                <p>{availableBeds} beds available</p>
                <p>{room.block?.block_name}</p>
              </RoomCard>
            );
          })}
        </RoomGrid>
      </Section>

      {/* ===================== ACTION ===================== */}
      <Button
        disabled={!selectedRegistration || !selectedRoom}
        onClick={handleAssign}
      >
        Assign Room
      </Button>
    </Container>
  );
}
