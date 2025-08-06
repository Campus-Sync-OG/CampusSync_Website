import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/images/profile.png";
import editimg from "../assets/images/edit.png";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import { getParentInfo, updateParentInfo,updateParentInfos } from "../api/ClientApi";

const ParentProfile = () => {
  const [parentInfo, setParentInfo] = useState({});
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const imageInputRef = useRef(null);
  const [uploadTarget, setUploadTarget] = useState(""); // 'father_image' or 'mother_image'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser?.unique_id) {
          setError("No student logged in");
          setLoading(false);
          return;
        }

        const admissionNo = storedUser.unique_id;
        const { data } = await getParentInfo(admissionNo);

        setParentInfo({
          admission_no: data.admission_no,
          father_name: data.father_name,
          father_email: data.father_email,
          father_contact: data.father_contact,
          father_image: data.father_image || profileImage,
          mother_name: data.mother_name,
          mother_email: data.mother_email,
          mother_contact: data.mother_contact,
          mother_image: data.mother_image || profileImage,
          address: data.address,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  const fieldsToShow = [
    { label: "Father Name", key: "father_name", editable: true },
    { label: "Father Email", key: "father_email", editable: true },
    { label: "Father Contact", key: "father_contact", editable: false },
    { label: "Mother Name", key: "mother_name", editable: true },
    { label: "Mother Email", key: "mother_email", editable: true },
    { label: "Mother Contact", key: "mother_contact", editable: false },
    { label: "Address", key: "address", editable: false },
  ];

  const handleEdit = (key) => {
    setEditField(key);
    setTempValue(parentInfo[key]);
  };

  const handleSave = async (key) => {
    const admissionNo = parentInfo.admission_no;
    if (!admissionNo) return;

    if (tempValue === parentInfo[key]) {
      alert("No changes made.");
      return;
    }

    const updatedData = { [key]: tempValue };

    try {
      const response = await updateParentInfos(admissionNo, updatedData);
      if (response?.message === "No changes detected") {
        alert("No changes detected.");
        return;
      }

      setParentInfo((prev) => ({
        ...prev,
        [key]: tempValue,
      }));
      setEditField(null);
      setSuccessMessage("Information updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert("Update failed");
      console.error(err);
    }
  };

  const handleImageButtonClick = (targetKey) => {
    setUploadTarget(targetKey);
    imageInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !uploadTarget) return;

    const admissionNo = parentInfo.admission_no;
    const formData = new FormData();
    formData.append(uploadTarget, file); // either 'father_image' or 'mother_image'

    try {
      const response = await updateParentInfo(admissionNo, formData);
      setParentInfo((prev) => ({
        ...prev,
        [uploadTarget]: response?.parent?.[uploadTarget] || prev[uploadTarget],
      }));
      setSuccessMessage("Image updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert("Image upload failed");
      console.error(err);
    }
  };

  const handleHomeClick = () => navigate("/dashboard");
  const handleBackClick = () => navigate(-1);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="parent-profile-page">
      <div className="main-container">
        <div className="content">
          <div className="navigation-container">
            <h2 className="nav-title">Parent Information</h2>
            <div className="nav-icons-container">
              <img src={homeIcon} alt="Home" className="nav-icon" onClick={handleHomeClick} />
              <div className="icon-divider" />
              <img src={backIcon} alt="Back" className="nav-icon" onClick={handleBackClick} />
            </div>
          </div>

          {successMessage && <div className="success-message">{successMessage}</div>}

          <div className="profile-container">
            <div className="parent-profile-section">
              {/* 👨‍👩‍👦 Father Image */}
              <div className="profile-picture-container">
                <img src={parentInfo.father_image} alt="Father" className="profile-picture" />
                <button onClick={() => handleImageButtonClick("father_image")}>
                  Change Father Photo
                </button>
              </div>

              {/* 👩‍👦 Mother Image */}
              <div className="profile-picture-container">
                <img src={parentInfo.mother_image} alt="Mother" className="profile-picture" />
                <button onClick={() => handleImageButtonClick("mother_image")}>
                  Change Mother Photo
                </button>
              </div>

              {/* 🔁 Shared image input */}
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              <div className="info-grid">
                {fieldsToShow.map(({ label, key, editable }) => (
                  <div className="info-item" key={key}>
                    <label>{label}:</label>
                    {editField === key && editable ? (
                      <div className="edit-container">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                        />
                        <button onClick={() => handleSave(key)}>Save</button>
                      </div>
                    ) : (
                      <div className="value-container">
                        <span>{parentInfo[key]}</span>
                        {editable && (
                          <button onClick={() => handleEdit(key)}>
                            <img src={editimg} alt="Edit" className="edit-icon" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
