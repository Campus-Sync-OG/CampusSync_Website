import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import { fetchExamFormats, generateMarksheet } from "../api/ClientApi";  // Your API utility


const Academics = () => {
  const [filter, setFilter] = useState("All");
  const [examNames, setExamNames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadExamNames = async () => {
      const formats = await fetchExamFormats();
      if (formats.length > 0) {
        const names = Array.from(new Set(formats.map(f => f.exam_name)));
        setExamNames(names);
      }
    };
    loadExamNames();
  }, []);

  const handleHomeClick = () => navigate("/dashboard");
  const handleBackClick = () => navigate(-1);

  const getAdmissionNo = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.unique_id || "";
  };

  const handleView = async (examName) => {
    const admission_no = getAdmissionNo();
    if (!admission_no) {
      alert("Missing admission number. Please log in again.");
      return;
    }
    const url = await generateMarksheet(admission_no, examName);
    if (url) {
      window.open(url, "_blank");
    } else {
      alert("Failed to generate or view marksheet.");
    }
  };

  const handleDownload = async (examName) => {
    const admission_no = getAdmissionNo();
    if (!admission_no) {
      alert("Missing admission number. Please log in again.");
      return;
    }
    const url = await generateMarksheet(admission_no, examName);
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = `Marksheet_${admission_no}_${examName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Failed to generate or download marksheet.");
    }
  };

  // Determine what to display
  const displayResults = 
    filter === "All"
      ? examNames
      : examNames.filter(name => name === filter);

  return (
    <Page>
      <MainLayout>
        <MainContent>
          <NavContainer>
            <NavTitle>Academics</NavTitle>
            <NavIcons>
              <NavIcon src={homeIcon} alt="Home" onClick={handleHomeClick} />
              <IconDivider />
              <NavIcon src={backIcon} alt="Back" onClick={handleBackClick} />
            </NavIcons>
          </NavContainer>

          <FilterContainer>
            <label htmlFor="assessmentFilter">Assessment Type: </label>
            <select
              id="assessmentFilter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              {examNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </FilterContainer>

          <Content>
            {displayResults.length > 0 ? (
              <ResultsTable>
                <thead>
                  <tr>
                    <th>Exam Name</th>
                    <th>View</th>
                    <th>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {displayResults.map((name, index) => (
                    <tr key={index}>
                      <td>{name}</td>
                      <td>
                        <ViewLink onClick={() => handleView(name)}>View</ViewLink>
                      </td>
                      <td>
                        <DownloadLink onClick={() => handleDownload(name)}>Download</DownloadLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ResultsTable>
            ) : (
              <NoResults>No exams available.</NoResults>
            )}
          </Content>
        </MainContent>
      </MainLayout>
    </Page>
  );
};

export default Academics;



// styled components (same as before — no change required)


// STYLED COMPONENTS

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const MainLayout = styled.div`
  display: flex;
  flex: 1;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 0 15px;
  background-color: #f9f9f9;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 15px 20px;
  border-radius: 10px;
  color: white;
`;

const NavTitle = styled.h2`
  font-size: 26px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
`;

const NavIcons = styled.div`
  display: flex;
  align-items: center;
`;

const NavIcon = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
  padding: 10px;
`;

const IconDivider = styled.div`
  width: 1px;
  height: 20px;
  background-color: white;
`;

const FilterContainer = styled.div`
  margin-bottom: 15px;
  margin-top: 50px;
  display: flex;
  align-items: center;
  gap: 10px;

  label {
    font-size: 16px;
    font-weight: 500;
  }

  select {
    padding: 5px 10px;
    font-family: 'Poppins', sans-serif;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
`;

const Content = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ResultsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;

  th {
    background-color: #002087;
    color: white;
    padding: 12px;
    text-align: center;
  }

  td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    text-align: center;
  }
`;

const DownloadLink = styled.a`
  color: red;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ViewLink = styled.span`
  color: blue;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const NoResults = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
`;
