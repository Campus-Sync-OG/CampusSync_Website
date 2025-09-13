import React, { useState, useEffect } from "react";
import styled from "styled-components";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import { useNavigate, Link } from "react-router-dom";
import {
  createStudent,
  createParent,
  getAllClassSections,
} from "../api/ClientApi"; // Adjust the import based on your API structure
 


 
const SectionTitle = styled.h2`
  color: #002e9f;
  font-size: 18px;
`;
 

 
const Input = styled.input`
  padding: 12px;
  width: 90%;
  border: none;
  border-radius: 5px;
  background-color: #f1f2f7;
  font-size: 14px;
  outline: none;
 
  &::placeholder {
    color: #888;
  }
`;
 
const Select = styled.select`
  padding: 12px;
  width: 100%;
  border: none;
  border-radius: 5px;
  background-color: #f1f2f7;
  font-size: 14px;
  color: #333;
  outline: none;
`;
 

 


 
const ProfilePreview = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #e0e0e0;
 
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #002087;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const IconBtn = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const VerticalDivider = styled.div`
  width: 1px;
  background: #ccc;
  height: 30px;
  margin: 0 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ImageContainer = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  align-items: flex-start;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.7rem 2rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  background: ${(props) => (props.variant === "reset" ? "#df0043" : "#002087")};
  color: white;
`;

 
const StudentInformation = () => {
  const [formData, setFormData] = useState({
    admission_no: "",
    student_name: "",
    phone_no: "",
    alter_no: "",
    dob: "",
    gender: "",
    status: "active",
    class: "",
    section: "",
    roll_no: "",
    blood_group: "",
    religion: "",
    father_name: "",
    father_contact: "",
    father_email: "",
    mother_name: "",
    mother_contact: "",
    mother_email: "",
    address: "",
  });
 
  const [photo, setPhoto] = useState(null);
  const [classSections, setClassSections] = useState([]);
  const [selectedClassSection, setSelectedClassSection] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
 
  const navigate = useNavigate();
 
  // Fetch class and section data
  useEffect(() => {
    const fetchClassSections = async () => {
      try {
        const data = await getAllClassSections();
        setClassSections(data);
 
        const uniqueClasses = Array.from(
          new Set(data.map((item) => item.className))
        ).map((cls) => ({ className: cls }));
 
        const uniqueSections = Array.from(
          new Set(data.map((item) => item.section_name))
        ).map((sec) => ({ section_name: sec }));
 
        setClassSections(uniqueClasses);
        setSelectedClassSection(uniqueSections);
      } catch (error) {
        console.error("Failed to fetch class sections:", error);
      }
    };
 
    fetchClassSections();
  }, []);
 
  // Sync selected class/section to formData
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      class: selectedClass,
      section: selectedSection,
    }));
  }, [selectedClass, selectedSection]);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        admission_no,
        student_name,
        phone_no,
        alter_no,
        dob,
        gender,
        status,
        class: className, // Use className if backend expects it
        section,
        roll_no,
        religion,
        blood_group,
        father_name,
        father_contact,
        father_email,
        mother_name,
        mother_contact,
        mother_email,
        address,
      } = formData;
 
      // Create FormData for student (including photo)
      const studentFormData = new FormData();
      studentFormData.append("admission_no", admission_no);
      studentFormData.append("student_name", student_name);
      studentFormData.append("phone_no", phone_no);
      studentFormData.append("alter_no", alter_no);
      studentFormData.append("dob", dob);
      studentFormData.append("gender", gender);
      studentFormData.append("status", status);
      studentFormData.append("class", className);
      studentFormData.append("section", section);
      studentFormData.append("roll_no", roll_no);
      studentFormData.append("blood_group", blood_group);
      studentFormData.append("religion", religion);
      studentFormData.append("photo", photoFile); // ✅ this is what backend expects
 
      // Parent payload (sent as JSON)
      const parentPayload = {
        admission_no,
        father_name,
        father_contact,
        father_email,
        mother_name,
        mother_contact,
        mother_email,
        address,
        religion,
      };
 
      await createStudent(studentFormData); // Send FormData
      await createParent(parentPayload);
 
      alert("Student and Parent saved successfully");
      navigate("/admin-student-information");
    } catch (err) {
      console.error(err);
      alert("Failed to save information");
    }
  };
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
 
    if (name === "photo" && files.length > 0) {
      const file = files[0];
      setPhotoFile(file); // store the actual file for upload
      setPhoto(URL.createObjectURL(file)); // for preview
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
 
  return (
    <Container>
      <Header>
        <Title>Student Information</Title>
        <IconWrapper>
          <Link to="/admin-dashboard">
            <IconBtn src={homeIcon} alt="Home" title="Home" />
          </Link>
          <VerticalDivider />
          <div
            onClick={() => navigate(-1)}
            style={{ display: "inline-block", cursor: "pointer" }}
          >
            <IconBtn src={backIcon} alt="Back" title="Back" />
          </div>
        </IconWrapper>
      </Header>
 
      <Form onSubmit={handleSubmit}>
        <SectionTitle>Add New Students</SectionTitle>
        <ImageContainer>
          <ProfilePreview>
            {photo && (
              <img
                src={photo}
                alt="Preview"
                style={{ width: 100, height: 100 }}
              />
            )}
          </ProfilePreview>
          <div>
            <label>Upload Student Photo (150px x 150px)</label>
            <br />
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleInputChange}
            />
          </div>
        </ImageContainer>
 
        <Row>
          
          <div>
            <label>Admission No *</label>
            <Input
              name="admission_no"
              value={formData.admission_no}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Name *</label>
            <Input
              name="student_name"
              value={formData.student_name}
              onChange={handleChange}
              required
            />
          </div>
        
 
       
          <div>
            <label>Gender *</label>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Please Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Select>
          </div>
          </Row>
          <Row>
          <div>
            <label>Class *</label>
            <Select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              required
            >
              <option value="">Select Class</option>
              {classSections.map((cls, index) => (
                <option key={index} value={cls.className}>
                  {cls.className}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label>Section *</label>
            <Select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              required
            >
              <option value="">Select Section</option>
              {selectedClassSection.map((sec, index) => (
                <option key={index} value={sec.section_name}>
                  {sec.section_name}
                </option>
              ))}
            </Select>
          </div>
        
 
       
          <div>
            <label>Roll No</label>
            <Input
              name="roll_no"
              value={formData.roll_no}
              onChange={handleChange}
            />
          </div>
          </Row>
<Row>
          <div>
            <label>Date Of Birth *</label>
            <Input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Blood group</label>
            <Input
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Religion *</label>
            <Select
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              required
            >
              <option value="">Select Religion</option>
              <option>Hindu</option>
              <option>Muslim</option>
              <option>Christian</option>
            </Select>
          </div>
        </Row>
        <Row>
          <div>
            <label>Phone No *</label>
            <Input
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Alternate No</label>
            <Input
              name="alter_no"
              value={formData.alter_no}
              onChange={handleChange}
            />
          </div>
          
        </Row>
 
        <SectionTitle>Parents Information</SectionTitle>
 
        <Row>
          <div>
            <label>Father's Name</label>
            <Input
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Father's Contact</label>
            <Input
              name="father_contact"
              value={formData.father_contact}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Father's Email</label>
            <Input
              name="father_email"
              value={formData.father_email}
              onChange={handleChange}
            />
          </div>
        </Row>
 
        <Row>
          <div>
            <label>Mother's Name</label>
            <Input
              name="mother_name"
              value={formData.mother_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Mother's Contact</label>
            <Input
              name="mother_contact"
              value={formData.mother_contact}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Mother's Email</label>
            <Input
              name="mother_email"
              value={formData.mother_email}
              onChange={handleChange}
            />
          </div>
        </Row>
 
        <Row>
          <div>
            <label>Address *</label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </Row>
 
        <ButtonGroup>
          <Button type="submit">Save</Button>
          <Button type="reset" variant="reset">
            Reset
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};
 
export default StudentInformation;