import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import principalImage from "../assets/images/principaldashboard.png";

const DashboardContainer = styled.div`
  flex: 1;
  width: 100%;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 40px;
`;

const QuickTileRow = styled.div`
  display: flex;
  gap: 14px;
  overflow-x: auto;
  width: 95%;
  padding: 12px 5px;
  margin-top: 10px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const QuickTile = styled.div`
  min-width: 140px;
  height: 70px;
  background: white;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  font-family: "Poppins";
  color: #002087;
  cursor: pointer;
  box-shadow: 0 4px 10px #00000015;
  transition: 0.2s;
  &:hover { transform: translateY(-2px); }
`;

const StatsPanel = styled.div`
  width: 90%;
  background: #00208710;
  border-radius: 18px;
  padding: 18px;
  margin-top: 15px;
  display: flex;
  justify-content: space-around;
  text-align: center;
  font-family: "Roboto";
`;

const Stat = styled.div`
  .val {
    font-size: 24px;
    font-weight: 700;
    color: #002087;
  }
  .label {
    font-size: 13px;
    color: #444;
  }
`;

const MenuList = styled.div`
  width: 90%;
  margin-top: 18px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 9px #00000010;
  overflow: hidden;
`;

const MenuItem = styled.div`
  padding: 16px 18px;
  border-bottom: 1px solid #df004320;
  font-size: 17px;
  font-weight: 600;
  color: #000;
  cursor: pointer;
  font-family: "Poppins";
  display: flex;
  align-items: center;
  gap: 10px;
  &:last-child { border: none; }
  &:hover { background: #df004305; }
`;

const PillActions = styled.div`
  width: 90%;
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const PillButton = styled.button`
  background: linear-gradient(90deg, #df0043, #002087);
  color: white;
  border: none;
  padding: 12px 22px;
  font-size: 14px;
  border-radius: 34px;
  font-weight: 600;
  font-family: "Poppins";
  cursor: pointer;
  box-shadow: 0 3px 8px #00000014;
  transition: 0.3s;
  &:hover {
    transform: scale(1.06);
    box-shadow: 0 5px 14px #00000025;
  }
`;

const HostelDashboard = () => {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <DashboardContainer>

      {/* ❗Header is NOT changed at all */}
      <div
        style={{
          background: "linear-gradient(135deg, #002087, #df0043)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          borderRadius: "27px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          height: "150px",
          width: "95%",
          position: "relative",
        }}
      >
        <div className="text">
          <div
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              position: "absolute",
              top: "10px",
              left: "20px",
              fontFamily: "Poppins",
            }}
          >
            Dashboard
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "25px",
              left: "20px",
              fontSize: "25px",
              fontFamily: "Roboto",
            }}
          >
            Welcome, Hostel
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              left: "20px",
              fontSize: "15px",
              fontFamily: "Roboto",
            }}
          >
            {today}
          </div>
        </div>
        <img
          style={{ width: "180px", height: "160px", marginRight: "30px", objectFit: "cover" }}
          src={principalImage}
          alt="Welcome"
        />
      </div>

      {/* ✅ New UI Elements start here */}

      {/* 1️⃣ Quick Scroll Tiles */}
      <QuickTileRow>
        <QuickTile onClick={() => navigate("/hostel-room-availability")}>Room Availability</QuickTile>
        <QuickTile onClick={() => navigate("/hostel-student-data")}>Student Data</QuickTile>
        <QuickTile onClick={() => navigate("/hostel-fee-details")}>Fee Details</QuickTile>
        <QuickTile onClick={() => navigate("/hostel-attendance")}>Attendance</QuickTile>
        <QuickTile onClick={() => navigate("/hostel-leave-request")}>Leave Request</QuickTile>
        <QuickTile onClick={() => navigate("/hostel-complaints")}>Complaints</QuickTile>
      </QuickTileRow>

      {/* 2️⃣ Hostel Live Stats */}
      <StatsPanel>
        <Stat><div className="val">120</div><div className="label">Total Students</div></Stat>
        <Stat><div className="val">52</div><div className="label">Rooms</div></Stat>
        <Stat><div className="val">18</div><div className="label">Complaints</div></Stat>
      </StatsPanel>

      {/* 3️⃣ Menu List Navigation */}
      <MenuList>
        <MenuItem onClick={() => navigate("/hostel-student-data")}>📘 Manage Students</MenuItem>
        <MenuItem onClick={() => navigate("/hostel-attendance")}>✅ Student Attendance</MenuItem>
        <MenuItem onClick={() => navigate("/hostel-fee-details")}>💰 Fee Records</MenuItem>
        <MenuItem onClick={() => navigate("/hostel-leave-request")}>📩 Leave Approvals</MenuItem>
        <MenuItem onClick={() => navigate("/hostel-room-availability")}>🏠 View Rooms</MenuItem>
        <MenuItem onClick={() => navigate("/hostel-complaints")}>🚨 Complaints</MenuItem>
      </MenuList>

      {/* 4️⃣ Pill Style Quick Actions */}
      <PillActions>
        <PillButton onClick={() => navigate("/hostel-add-room")}>+ Add Room</PillButton>
      </PillActions>

    </DashboardContainer>
  );
};

export default HostelDashboard;
