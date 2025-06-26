// circular.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/images/home.png"; // adjust path if needed
import backIcon from "../assets/images/back.png";
import { fetchCircularsByAdmissionNo } from "../api/ClientApi";

const CircularPage = () => {
  const navigate = useNavigate();
  const [circulars, setCirculars] = useState([]);

  // ✅ Get admission_no from localStorage (from stored student data)
  const admission_no = JSON.parse(localStorage.getItem("user"))?.unique_id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admission_no) {
          const data = await fetchCircularsByAdmissionNo(admission_no);
          setCirculars(data);
        } else {
          console.warn(
            "No admission number (unique_id) found in localStorage."
          );
        }
      } catch (err) {
        console.error("Error fetching circulars:", err);
        setCirculars([]);
      }
    };

    fetchData();
  }, [admission_no]);
  console.log("admission_no:", admission_no);

  const handleHomeClick = () => {
    navigate("/dashboard");
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Container>
      <NavContainer>
        <Title>Circular</Title>
        <IconsContainer>
          <ImageIcon src={homeIcon} alt="Home" onClick={handleHomeClick} />
          <Divider />
          <ImageIcon src={backIcon} alt="Back" onClick={handleBackClick} />
        </IconsContainer>
      </NavContainer>

      <Table>
        <thead>
          <TableRow header>
            <TableHead>Sl no.</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Headline</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Attachment</TableHead>
          </TableRow>
        </thead>
        <tbody>
          {circulars.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.headline}</TableCell>
              <TableCell>
                {item.note?.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </TableCell>
              <TableCell>
                {item.attachment_url ? (
                  <DownloadLink
                    href={item.attachment_url}
                    target="_blank"
                    download
                  >
                    Download
                  </DownloadLink>
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default CircularPage;

/* Styled Components */
const Container = styled.div`
  padding: 0 15px;
  width: 100%;
  margin: auto;
  max-height: 90vh;
  overflow-y: auto;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 10px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  height: 55px;
  width: 95%;
`;

const Title = styled.h2`
  color: white;
  font-size: 26px;
  font-weight: 600;
  font-family: "Poppins";
  @media (max-width: 426px) {
    font-size: 20px;
  }
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Divider = styled.div`
  width: 2px;
  height: 20px;
  background-color: white;
  margin: 0 10px;
`;

const ImageIcon = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  font-family: Poppins;
`;

const TableRow = styled.tr`
  background-color: ${(props) => (props.header ? "#002087" : "#fff")};
  color: ${(props) => (props.header ? "#fff" : "#333")};
  font-weight: ${(props) => (props.header ? "600" : "normal")};
  border-bottom: 1px solid #ccc;
`;

const TableHead = styled.th`
  padding: 10px;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 12px;
  vertical-align: top;
`;

const DownloadLink = styled.a`
  color: #d9534f;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
`;
