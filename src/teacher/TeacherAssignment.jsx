import React, { useState, useEffect } from "react";
import styled from "styled-components";
import homeIcon from "../assets/images/home.png"; // Replace with actual path
import backIcon from "../assets/images/back.png"; // Replace with actual path
import { useNavigate } from "react-router-dom";
import { getAllClassSections, getAllSubjects, submitAssignment } from "../api/ClientApi";
const AssignmentPage = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [date, setDate] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [file, setFile] = useState(null);
  const [submittedData, setSubmittedData] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [selectedClassSection, setSelectedClassSection] = useState([]);
  const [subjectList, setSelectedSubjects] = useState([]);


  useEffect(() => {
    const fetchClassSections = async () => {
      try {
        const data = await getAllClassSections();

        // Store complete data for filtering later
        setClassSections(data);

        // Extract unique class names
        const uniqueClasses = Array.from(new Set(data.map(item => item.className)))
          .map(cls => ({ className: cls }));

        const uniqueSections = Array.from(new Set(data.map(item => item.section_name)))
          .map(sec => ({ section_name: sec }));

        setClassSections(uniqueClasses); // reuse this as class list
        setSelectedClassSection(uniqueSections);
      } catch (error) {
        console.error("Failed to fetch class sections:", error);
      }
    };

    fetchClassSections();
  }, []);

  useEffect(() => {
    getAllSubjects()
      .then((data) => {
        const allSubjects = data.subjects?.map((s) => s.subject_name) || [];
        const uniqueSubjects = [...new Set(allSubjects)];
        setSelectedSubjects(uniqueSubjects);
      })
      .catch((err) => console.error("Error fetching subjects:", err));
  }, []);

  const handleSubmit = async () => {
    if (!selectedClass || !selectedSection || !selectedSubject || !date || !assignmentTitle || !file) {
      alert("All fields are required before submitting.");
      return;
    }

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      const emp_id = loggedInUser?.unique_id; // ✅ make sure empId is defined

      if (!emp_id) {
        alert("Employee ID not found. Please login again.");
        return;
      }
      console.log('Logged in employee ID:', emp_id);

      const formData = new FormData();
      formData.append("subjects", selectedSubject);
      formData.append("title", assignmentTitle);
      formData.append("Date", date);
      formData.append("attachment", file);
      formData.append("class_name", selectedClass);
      formData.append("section", selectedSection);
      formData.append("emp_id", emp_id);

      // Log the FormData object to check its content
      console.log('Form Data:', {
        subjects: selectedSubject,
        title: assignmentTitle,
        Date: date,
        class_name: selectedClass,
        section: selectedSection,
        attachment: file,
        emp_id
      });

      // Check if formData is being populated properly
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      await submitAssignment(emp_id, formData); // pass empId to API
      alert("Assignment submitted successfully!");
      resetFields(); // optional: clear the form
      console.log('Form Data:', {
        subjects: selectedSubject,
        title: assignmentTitle,
        Date: date,
        class_name: selectedClass,
        section: selectedSection,
        attachment: file,
        emp_id
      });
    } catch (err) {
      // Log the error received from the backend
      console.error("Submission failed:", err);

      // If the error is an Axios error, print the response details
      if (err.response) {
        console.error("Backend Response:", err.response.data);
        alert(`Submission failed: ${err.response.data.message || 'Unknown error'}`);
      } else {
        alert("Submission failed. Please try again.");
      }
    }
  };


  // Function to submit and reset fields for new entry
  const handleAddMore = () => {

    resetFields(); // Clear the fields
  };

  // Function to clear all fields
  const resetFields = () => {
    setSelectedClass("");
    setSelectedSection("");
    setSelectedSubject("");
    setSelectedFaculty("");
    setDate("");
    setAssignmentTitle("");
    setFile(null);
  };
  const navigate = useNavigate(); // Hook for navigation

  const handleHomeClick = () => {
    navigate("/teacher-dashboard"); // Navigate to Dashboard
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };
  return (
    <PageContainer>
      {/* Navigation Bar */}
      <NavContainer>
        <Title> Assignment</Title>
        <IconsContainer>
          <Icon src={homeIcon} alt="Home" onClick={handleHomeClick} />
          <Divider />
          <Icon src={backIcon} alt="Back" onClick={handleBackClick} />
        </IconsContainer>
      </NavContainer>
      <h3>Add Assignment</h3>
      {/* First Row - 4 Dropdowns */}
      <DropdownContainer>
        <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">Select Class</option>
          {classSections.map((cls, index) => (
            <option key={index} value={cls.className}>{cls.className}</option>
          ))}
        </Select>


        <Select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
          <option value="">Select Section</option>
          {selectedClassSection.map((sec, index) => (
            <option key={sec.id} value={sec.section_name}>{sec.section_name}</option>
          ))}

        </Select>

        <Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
          <option value="">Select Subject</option>
          {subjectList.map((sub, index) => (
            <option key={index} value={sub}>{sub}</option>
          ))}
        </Select>
      </DropdownContainer>

      {/* Second Row - Date, Title, File Upload */}
      <InputContainer>
        <Input
          type="date"
          placeholder="Select date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value); // already in correct format
          }}
          
        />
        

        <Input type="text" placeholder="Assignment Title" value={assignmentTitle} onChange={(e) => setAssignmentTitle(e.target.value)} />
        <FileInput type="file" onChange={(e) => setFile(e.target.files[0])} />
      </InputContainer>

      {/* Buttons */}
      <ButtonContainer>
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
        <AddMoreButton onClick={handleAddMore}>Add More</AddMoreButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default AssignmentPage;

// Styled Components
const PageContainer = styled.div`
  width: 95%;
  margin: auto;
  padding: 10px;
  h3{
  color:#002087;
  font-weight: 100;
  }
  font-family:Poppins;
  @media (max-width: 426px) {
    max-height:90vh; 
    overflow-y:auto;   
    font-size:14px;
    }
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #002087, #d9534f);
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  height:40px;
`;

const Title = styled.h2`
  color: white;
  font-size: 25px;
  font-weight: bold;
   @media (max-width: 426px) {
    
    font-size:20px;
    }
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`;

const Divider = styled.div`
  width: 2px;
  height: 20px;
  background-color: white;
  margin: 0 10px;
`;

const DropdownContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  
 @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two columns */
    gap: 10px;
  }
  @media (max-width: 426px) {
     grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  margin-top:80px;
 @media (max-width: 768px) {
    margin-top:15px;
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two columns */
    gap: 10px;
  }
  @media (max-width: 426px) {
   grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const FileInput = styled.input`
  flex: 1;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
   @media (max-width: 426px) {
    gap:150px;
    }
`;

const SubmitButton = styled.button`
  background-color: #d9534f;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #c9302c;
  }
`;

const AddMoreButton = styled.button`
  background-color: #002087;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #00166b;
  }
`;
