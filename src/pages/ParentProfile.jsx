import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/images/profile.png";
import editimg from "../assets/images/edit.png";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import { getParentInfo ,updateParentInfo} from "../api/ClientApi";  // Make sure the path is correct

const ParentProfile = () => {
  const [parentInfo, setParentInfo] = useState({
    
  });
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const[successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // Fetch the logged-in student's admission number
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
        console.log("Fetching parent data for admission_no:", admissionNo);
    
        // 3. Fetch parent details using the admission_no
        const { data } = await getParentInfo(admissionNo);  // Destructure data here
        
        console.log("Fetched parent data:", data);
  
      
  
        // 5. Update the state with the fetched data
        setParentInfo({
          admission_no: data.admission_no,
          father: {
            father_name: data.father_name,
            email: data.father_email,
            gender: data.father_gender,
            admissionId: data.admission_no,
            dob: data.father_dob,
            religion: data.religion,
            phoneNumber: data.father_contact,
            profilePicture: profileImage,
            Adress: data.address,
          },
          mother: {
            name: data.mother_name,
            email: data.mother_email,
            gender: data.mother_gender,
            admissionId: data.admission_no,
            dob: data.mother_dob,
            religion: data.religion,
            phoneNumber: data.mother_contact,
            profilePicture: profileImage,
            Adress: data.address,
          }
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to fetch parent data");
      } finally {
        setLoading(false);
      }
    };
  
    getLoggedInStudent();
  }, []);
  

  const handleEdit = (parent, field) => {
    setEditField({ parent, field });
    setTempValue(parentInfo[parent][field]);
  };

  const handleSave = async () => {
    const { parent, field } = editField;
    const admissionNo = parentInfo.admission_no;
  
    console.log("Admission No used for update:", admissionNo);  // ✅ Add this!
  
    if (!admissionNo) {
      alert("Admission number not found.");
      return;
    }
  
    const updatedData =
      parent === "father"
        ? {
            father_name:
              field === "father_name"
                ? tempValue
                : parentInfo.father.father_name,
            father_email:
              field === "email" ? tempValue : parentInfo.father.email,
          }
        : {
            mother_name: field === "name" ? tempValue : parentInfo.mother.name,
            mother_email:
              field === "email" ? tempValue : parentInfo.mother.email,
          };
  
    try {
      await updateParentInfo(admissionNo, updatedData);
  
      setParentInfo((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: tempValue,
        },
      }));
      setEditField(null);
      setSuccessMessage("Successfully updated!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update parent info");
    }
  };
  
  

  const handleHomeClick = () => {
    navigate("/dashboard");
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const renderInfo = (parent) => (
    <div className="parent-profile-section">
      <img
        src={parentInfo[parent].profilePicture}
        alt={`${parent} Profile`}
        className="profile-picture"
      />
      <h3>{parent.charAt(0).toUpperCase() + parent.slice(1)} Information</h3>
      <div className="info-grid">
        {Object.keys(parentInfo[parent]).map(
          (key) =>
            key !== "profileImage" && ( // Exclude profileImage field from displaying in details
              <div className="info-item" key={key}>
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                {["name", "email"].includes(key) && editField?.parent === parent && editField?.field === key ? (
                  <>
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                    />
                    <button onClick={handleSave}>Save</button>
                  </>
                ) : (
                  <>
                    <span>{parentInfo[parent][key]}</span>
                    {["name", "email"].includes(key) && (
                      <button onClick={() => handleEdit(parent, key)}>
                        <img src={editimg} alt="Edit" className="edit-icon" />
                      </button>
                    )}
                  </>
                )}
              </div>
            )
        )}
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="parent-profile-page">
      <div className="main-container">
        <div className="content">
          <div className="navigation-container">
            <h2 className="nav-title">Parents Information</h2>
            <div className="nav-icons-container">
              <img src={homeIcon} alt="Home" className="nav-icon" onClick={handleHomeClick} />
              <div className="icon-divider"></div>
              <img src={backIcon} alt="Back" className="nav-icon" onClick={handleBackClick} />
            </div>
          </div>
               
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          <div className="profile-container">
            <div className="parent-profiles">
              {renderInfo("father")}
              {renderInfo("mother")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;


/* CSS */
const styles = `
  .parent-profile-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .main-container {
    display: flex;
    flex: 1;
  }

  .content {
    padding: 20px;
    flex: 1;
    background-color: #f9f9f9;
    overflow-y: auto;
  }

  .navigation-container {
    display: flex;
  align-items: center;
  justify-content: space-between;
   background:linear-gradient(
  90deg,
  rgba(0, 32, 135, 1) 31%,    /* 100% opacity */
  rgba(0, 32, 135, 0.69) 69%, /* 69% opacity */
  #df0043 100%
)
;
  padding: 10px 20px;
  border-radius: 8px; /* Optional for rounded corners */
  color: white; /* Text color */
  }

  .nav-icons-container {
  display: flex; /* Ensures icons and divider are in a horizontal row */
  align-items: center; /* Ensures vertical alignment of items */
}

 .nav-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}
  .nav-icon {
    width: 25px;
    height: 25px;
    cursor: pointer;
  display: flex;
  align-items: center; /* Ensures icons and divider are vertically aligned */
  gap: 10px; 
  padding:4px;
  }
  .icon-divider {
  width: 1px; /* Thickness of the white line */
  height: 20px; /* Adjust to match the size of icons */
  background-color: white; /* White line */
}

  .profile-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .profile-container h2 {
    text-align: center;
    color: #002087;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .parent-profiles {
    display: flex;
    gap: 20px;
    flex-wrap:wrap;
  }

  .parent-profile-section {
    flex: 1;
    text-align: center;
    background:rgb(255, 254, 254);
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-width:300px;
  }

  .profile-picture {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 10px;
    border: 2px solid #ccc;
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr ;
    gap: 10px;
    margin-top: 10px;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:5px 0;
    flex-wrap:wrap;
    
  }

  .info-item label {
    font-weight: bold;
    align:left;
    
  }

  .info-item span {
    color: #555;
   flex:1;
  }

  .info-item input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .edit-icon {
    width: 16px;
    height: 16px;
    cursor: pointer;
    margin-left: 5px;
  }
    @media (max-width: 768px) {
  .parent-profiles {
    flex-direction: column; /* Stacks profiles vertically */
    align-items: center; /* Centers the content */
  }

  .parent-profile-section {
    width: 100%; /* Takes full width on small screens */
  }
    
 .info-grid {
    grid-template-columns: 1fr;
    padding: 0 16px; /* Single column layout */
  }

  .info-item {
   display: flex;
    flex-direction: row; /* Stack label, value, and icon */
    justify-content: space-between;
    align-items: center;
    gap:8px; /* Align items to the left */
  }

  .info-item label {
    font-size: 14px;
  text-align:left;
  width:auto;
  margin-left:0;
  margin:0;
  }

  .info-item span {
    text-align: left; /* Ensure the value aligns to the left */
    width: auto;
     word-wrap: break-word;
  }

  .info-item button {
    margin-left: 8px; /* Push button to the far right */
    padding: 5px; /* Add padding for better spacing */
    background: none; /* Remove background */
    border: none; /* Remove border */
    cursor: pointer;/* Moves edit icon to the right */
  }

}@media (min-width: 1200px) {
  .parent-profiles {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 3 columns */
    gap: 20px;
  }
}

/* 💻 Medium Screens (Tablets - 992px to 1199px) */
@media (max-width: 1199px) {
  .parent-profiles {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 columns */
    gap: 20px;
  }
}

/* 📱 Small Screens (Mobile - 768px to 991px) */
@media (max-width: 991px) {
  .parent-profiles {
    display: grid;
    grid-template-columns: 1fr; /* 1 column */
    gap: 15px;
  }
}

/* 📲 Extra Small Screens (Below 768px) */
@media (max-width: 768px) {
  .parent-profiles {
    flex-direction: column;
    align-items: center;
  }

  .parent-profile-section {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
    padding: 0 16px;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .info-item label {
    font-size: 14px;
    text-align: left;
    width: auto;
  }

  .info-item span {
    text-align: left;
    width: auto;
    word-wrap: break-word;
  }

  .info-item button {
    margin-left: 8px;
    padding: 5px;
    background: none;
    border: none;
    cursor: pointer;
  }
}

/* 🏆 Parent Profile Section */
.parent-profile-section {
  flex: 1;
  text-align: center;
  background: rgb(255, 254, 254);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 300px;
}

/* 🖼️ Profile Picture */
.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 2px solid #ccc;
}

/* 🏗️ Grid Structure */
.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-top: 10px;
}

/* 📋 Info Items */
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  flex-wrap: wrap;
}

/* 🏷️ Labels */
.info-item label {
  font-weight: bold;
  align: left;
}

/* 📝 Input Fields */
.info-item input {
  padding: 5px;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  width: 100%;
  background: transparent;
}

/* ✏️ Edit Icon */
.edit-icon {
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin-left: 5px;
}
  .success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 10px 15px;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
  margin: 15px 0;
  text-align: center;
  font-weight: bold;
}

`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
