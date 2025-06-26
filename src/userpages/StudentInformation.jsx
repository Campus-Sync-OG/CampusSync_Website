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
 
const Container = styled.div`
  padding: 0 15px;
  flex-direction: column;
  height: 70vh;
`;
 
const Header = styled.div`
  background: linear-gradient(90deg, #002087, #df0043);
  padding: 5px 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
`;
 
const Title = styled.h1`
  font-size: 26px;
  font-weight: 600;
  font-family: "Poppins";
`;
 
const Form = styled.form`
  margin-top: 20px;
`;
 
const SectionTitle = styled.h2`
  color: #002e9f;
  font-size: 18px;
`;
 
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
 
const VerticalDivider = styled.div`
  height: 25px;
  width: 2px;
  background-color: white;
`;
 
const IconBtn = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;
 
const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
 
  & > div {
    flex: 1 1 30%;
    margin: 10px;
    min-width: 250px;
  }
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
 
const ButtonGroup = styled.div`
  margin-top: 30px;
  display: flex;
  gap: 15px;
`;
 
const Button = styled.button`
  padding: 12px 30px;
  border: none;
  color: white;
  border-radius: 5px;
  font-weight: bold;
  background-color: ${(props) =>
    props.variant === "reset" ? "#002e9f" : "#d60000"};
  cursor: pointer;
`;
 
const ImageContainer = styled.div`
  margin: 30px 0;
  display: flex;
  gap: 30px;
  align-items: center;
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
        </Row>
 
        <Row>
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
        </Row>
 
        <Row>
          <div>
            <label>Roll No</label>
            <Input
              name="roll_no"
              value={formData.roll_no}
              onChange={handleChange}
            />
          </div>
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