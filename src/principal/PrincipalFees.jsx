import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { getAllFees, getAllClassSections } from "../api/ClientApi";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #002087b0, #df0043);
  padding: 18px 20px;
  border-radius: 10px;
  color: white;
  margin-left: 0px;
  width: 96%;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Divider = styled.div`
  width: 3px;
  height: 25px;
  background-color: white;
`;

const Icons = styled.div`
  width: 25px;
  height: 25px;
  cursor: pointer;
  img {
    width: 25px;
    height: 25px;
  }
`;

const Container = styled.div`
  padding: 20px;
  background: white;
  flex-direction: column;
  height: 70vh;
`;

const SearchBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;

  input,
  select,
  button {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  button {
    background: #d6003b;
    color: white;
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  @media (max-width: 420px) {
    flex-direction: column;
    align-items: stretch;

    input,
    select,
    button {
      width: 100%;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  th {
    background: #002087;
    color: white;
    padding: 10px;
    text-align: left;
  }

  td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  a {
    color: blue;
    cursor: pointer;
    text-decoration: underline;
  }
`;

const Note = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 10px;
`;
const PrincipalFees = () => {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [classSections, setClassSections] = useState([]);

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let year = 2000; year <= currentYear; year++) {
    years.push(year);
  }

  useEffect(() => {
    fetchFees();
    fetchClassSections();
  }, []);

  const fetchFees = async () => {
    try {
      const data = await getAllFees();
      setReceipts(data);
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };

  const fetchClassSections = async () => {
    try {
      const data = await getAllClassSections();
      console.log("Class Sections:", data);
      setClassSections(data);
    } catch (error) {
      console.error("Error fetching class sections:", error);
    }
  };

  const uniqueClasses = [
    ...new Set(classSections.map((item) => item.className)),
  ];
  const uniqueSections = [
    ...new Set(
      classSections
        .filter((item) =>
          selectedClass
            ? String(item.className) === String(selectedClass)
            : true
        )
        .map((item) => item.section_name) // fix here
    ),
  ];

  const filteredReceipts = receipts.filter((receipt) => {
    const matchName = (receipt.student?.student_name || "")
      .toLowerCase()
      .includes(searchName.toLowerCase());

    const matchClass = selectedClass
      ? String(receipt.class_name) === String(selectedClass)
      : true;

    const matchSection = selectedSection
      ? receipt.section_name === selectedSection
      : true;

    const matchYear = selectedYear
      ? new Date(receipt.pay_date).getFullYear() === Number(selectedYear)
      : true;

    return matchName && matchClass && matchSection && matchYear;
  });

  const handleViewReceipt = (receipt) => {
    navigate("/receipt", { state: { receipt } });
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>Fees</Title>
        <Wrapper>
          <Link to="/principal-dashboard">
            <Icons>
              <img src={home} alt="home" />
            </Icons>
          </Link>
          <Divider />
          <Icons onClick={() => navigate(-1)}>
            <img src={back} alt="back" />
          </Icons>
        </Wrapper>
      </Header>

      <h3>Fees Receipt Information</h3>

      {/* Search Bar */}
      <SearchBar>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
            setSelectedSection(""); // reset section when class changes
          }}
        >
          <option value="">Select Class</option>
          {uniqueClasses.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        >
          <option value="">Select Section</option>
          {uniqueSections.map((sec) => (
            <option key={sec} value={sec.section_name}>
              {sec}
            </option>
          ))}
        </select>
      </SearchBar>

      {/* Table */}
      <Table>
        <thead>
          <tr>
            <th>Sl no</th>
            <th>Date</th>
            <th>Receipt Number</th>
            <th>Student Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>Fees type</th>
            <th>Amount Paid</th>
            <th>Payment Method</th>
            <th>Fees Receipt</th>
          </tr>
        </thead>
        <tbody>
          {filteredReceipts.length > 0 ? (
            filteredReceipts.map((receipt, index) => (
              <tr key={receipt.id}>
                <td>{index + 1}</td>
                <td>{new Date(receipt.pay_date).toLocaleDateString()}</td>
                <td>{receipt.receipt_no}</td>
                <td>{receipt.student?.student_name}</td>
                <td>{receipt.class_name}</td>
                <td>{receipt.section_name}</td>
                <td>{receipt.feestype}</td>
                <td>{receipt.paid_amount}</td>
                <td>{receipt.pay_method}</td>
                <td>
                  <a
                    onClick={() => handleViewReceipt(receipt)}
                    style={{ cursor: "pointer", color: "#007bff" }}
                  >
                    View
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No receipts found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Note>
        Note: Only paid receipts will be displayed here. For detailed queries,
        contact administration.
      </Note>
    </Container>
  );
};

export default PrincipalFees;
