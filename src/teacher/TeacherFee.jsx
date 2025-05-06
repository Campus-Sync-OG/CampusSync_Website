import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; 
import home from "../assets/images/home.png";
import back from "../assets/images/back.png";
import { getAllFees } from "../api/ClientApi"; // adjust the path as needed

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #002087, #002087b0, #df0043);
  padding: 18px 20px;
  border-radius: 10px;
  color: white;
  margin-left: 0px;
  width:96%;
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

const TeacherFee = () => {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [receipts, setReceipts] = useState([]);
  const years = [];
  const currentYear = new Date().getFullYear();

  for (let year = 2000; year <= currentYear; year++) {
    years.push(year);
  }

  // Updated class list to use Roman numerals
  const classes = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  const sections = ["A", "B", "C"];

 

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const data = await getAllFees();
        
        if (Array.isArray(data)) {
          setReceipts(data); // Set the data directly into state
        } else {
          console.error("Error: Received data is not an array", data);
          setReceipts([]); // If data is not an array, set empty array
        }
      } catch (error) {
        console.error("Error fetching fee data:", error);
        setReceipts([]); // Set empty array if there is an error
      }
    };

    fetchFees();
  }, []); 
  // Empty array ensures this runs only once
  const filteredReceipts = receipts.filter((receipt) => {
   
    const student = receipt.student || {}; // Access student details, assuming `student` object exists
    return (
      (selectedClass ? student.class === selectedClass : true) &&
      (selectedSection ? student.section === selectedSection : true)&&
      (searchName
        ? student.student_name
            .toLowerCase()
            .includes(searchName.toLowerCase()) // Case-insensitive search
        : true)
    );
  });

  const handleViewReceipt = (receipt) => {
    console.log("Viewing receipt for:", receipt.student.student_name);
    // You can navigate or open a modal here
  };
  return (
    <Container>
      <Header>
        <Title>Fees</Title>
        <Wrapper>
          <Link to="/teacher-dashboard">
            <Icons>
              <img src={home} alt="home" />
            </Icons>
          </Link>
          <Divider />
          <Link to="/teacher-dashboard">
            <Icons onClick={() => navigate(-1)}>
              <img src={back} alt="back" />
            </Icons>
          </Link>
        </Wrapper>
      </Header>

      <h3>Fees Receipt Information</h3>

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
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
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
          {sections.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>

        <button
          style={{
            background: "#d6003b",
            color: "white",
            padding: "8px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          SEARCH
        </button>
      </SearchBar>

      <Table>
        <thead>
          <tr>
            <th>Sl no</th>
            <th>Date</th>
            <th>Receipt Number</th>
            <th>Student Name</th>
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
                <td>{receipt.pay_date}</td>
                <td>{receipt.receipt_no}</td>
                <td>{receipt.student.student_name}</td>
                <td>{receipt.paid_amount}</td>
                <td>{receipt.pay_method}</td>
                <td>
                  <a onClick={() => handleViewReceipt(receipt)}>View</a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No records found</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Note>
        {/* add you note here  */}
      </Note>
    </Container>
  );
};

export default TeacherFee;
