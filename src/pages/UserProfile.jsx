import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudentByAdmissionNo } from "../api/ClientApi"; // Assuming this function hits the API to fetch student data
import bgImage from "../assets/images/bg.jpeg";
import editimg from "../assets/images/edit.png";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";

const UserInfo = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fieldLabels = {
    student_name: "Full Name",
    roll_no: "Roll Number",
    gender: "Gender",
    admission_no: "Admission Number",
    bloodGroup: "Blood Group",
    dob: "Date of Birth",
    religion: "Religion",
    phone_no: "PhoneNumber",
    alter_no: "AlternateNumber",
    admissionDate: "Date of Admission",
    class: "Class",
    section: "Section",
  };
  useEffect(() => {
    const getLoggedInStudent = async () => {
      try {
        // 1. Get the stored user data from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        
        if (!storedUser || !storedUser.unique_id) {
          setError("No student logged in");
          setLoading(false);
          return;
        }
        console.log("Stored user data:", storedUser);
        // 2. Use the unique_id from localStorage as admission_no
        const admissionNo = storedUser.unique_id;
        console.log("Fetching student data for admission_no:", admissionNo);
  
        // 3. Fetch student details using the admission_no
        const data = await fetchStudentByAdmissionNo(admissionNo);
        console.log("Fetched student data:", data);
        
        // 4. Verify the unique_id matches admission_no
        if (data.admission_no !== admissionNo) {
          setError("Student data mismatch");
          return;
        }
  
        setUserInfo(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };
  
    getLoggedInStudent();
  }, []);

  const handleEdit = (field) => {
    setEditField(field);
    setTempValue(userInfo[field]);
  };

  const handleSave = () => {
    setUserInfo({ ...userInfo, [editField]: tempValue });
    setEditField(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!userInfo) return null;

  return (
    <div className="user-info-page">
      <div className="content">
        {/* Background Section */}
        <div className="bg-container">
          <img src={bgImage} alt="Background" className="bg-image" />
          <div className="icons">
            <img src={homeIcon} alt="Home" className="nav-icon" onClick={() => navigate("/dashboard")} />
            <img src={backIcon} alt="Back" className="nav-icon" onClick={() => navigate(-1)} />
          </div>
          <div className="profile">
            <img
              src={userInfo.images}
              alt="Profile"
              className="profile-pic"
            />
            <h3 className="profile-name">{userInfo.name}</h3>
          </div>
        </div>

        {/* Info Section */}
        <div className="info-container">
          <h2 className="info-heading">Personal Information</h2>
          <div className="info-grid">
            <div className="info-column">
              {["student_name", "roll_no", "gender", "admission_no", "dob"].map((field) => (
                <div key={field} className="info-item">
                  <label>{fieldLabels[field]}:</label>

                  {editField === field ? (
                    <>
                      <input type="text" value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
                      <button onClick={handleSave}>Save</button>
                    </>
                  ) : (
                    <>
                      <span>{userInfo[field]}</span>
                      {["student_name", "dob"].includes(field) && (
                        <button className="edit-btn" onClick={() => handleEdit(field)}>
                          <img src={editimg} alt="Edit" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="info-column">
              {["phone_no", "alter_no", "class", "section"].map((field) => (
                <div key={field} className="info-item">
                  <label>{formatLabel(field)}:</label>
                  {editField === field ? (
                    <>
                      <input type="text" value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
                      <button onClick={handleSave}>Save</button>
                    </>
                  ) : (
                    <>
                      <span>{userInfo[field]}</span>
                      {["student_name", "dob"].includes(field) && (
                        <button className="edit-btn" onClick={() => handleEdit(field)}>
                          <img src={editimg} alt="Edit" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatLabel = (label) => {
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

export default UserInfo;




/* CSS */
const styles = `
  .user-info-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f9f9f9;
  }

  .content {
    margin-top: 0;
    padding: 20px;
  }

  .bg-container {
    position: relative;
    width: 100%;
     margin-top: 0; /* Remove any margin */
  padding-top: 0; 
    height: 220px;
  }

  .bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }

  .icons {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 10px;
  }

  .nav-icon {
    width: 25px;
    height: 25px;
    cursor: pointer;
  }

  .profile {
    position: absolute;
    bottom: -40px;
    left: 40px;
    display: flex;
    align-items: center;
  }

  .profile-pic {
  width: 120px;
  height: 120px;
  border-radius: 50%; /* makes it a circle */
  object-fit: cover;  /* ensures image fits without distortion */
  border: 3px solid #fff; /* optional: add a border */
}


  .profile-name {
    font-size: 20px;
    font-weight: bold;
    margin-left: 10px;
    color: white;
  }

  .info-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .info-heading {
    color: #002087;
    font-weight: bold;
    margin-bottom: 15px;
  }
/* General Styles */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Default: Two columns */
  gap: 20px;
  width: 100%;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px; /* Space between label and input */
  margin-bottom: 12px;
  width: 100%;
}

.info-item label {
  font-weight: bold;
  width: 150px; /* Fixed width for labels */
  text-align: left;
}

.info-item input, 
.info-item span {
  flex: 1; /* Inputs take available space */
  text-align: left;
  padding: 6px;
  border: none;
  outline:none;
  min-width: 0;
  white-space: nowrap; /* Keep input in one line */
  overflow: hidden;
  text-overflow: ellipsis; /* Add "..." if content is too long */
}

/* Edit Button */
.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: left;
}

.edit-btn img {
  width: 16px;
  height: 16px;
}

/* Large Screens (≥1440px) */
@media (min-width: 1440px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr); /* Two columns */
    gap: 25px;
  }
}

/* Medium Screens (≥1024px & <1440px) */
@media (max-width: 1439px) and (min-width: 1024px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* Tablets (≥768px & <1024px) */
@media (max-width: 1023px) and (min-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr; /* Switch to single column */
    gap: 16px;
  }

  .info-item {
    justify-content: flex-start;
  }

  .info-item label {
    width: auto; /* Auto adjust label width */
    font-size: 15px;
  }
}

/* Mobile (<768px) */
@media (max-width: 767px) {
  .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .info-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .info-item label {
    font-size: 14px;
    width: auto;
  }

  .info-item input, 
  .info-item span {
    width: 100%;
  }

  .edit-btn {
    margin-left: 5px;
       align-items: left;

  }
}

`;

// Inject styles dynamically
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
