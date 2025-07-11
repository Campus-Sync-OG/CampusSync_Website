import React, { useState, useEffect } from "react";
import homeIcon from "../assets/images/home.png";
import backIcon from "../assets/images/back.png";
import { useNavigate } from "react-router-dom";
import { submitAchievement, getAllClassSections } from "../api/ClientApi";

const Achievement = () => {
  const handleBackClick = () => navigate(-1);
  const [formData, setFormData] = useState({
    currentClass: "",
    section: "",
    title: "",
    description: "",
    images: null,
    certificateurl: null,
  });

  const [admission_no, setAdmissionNo] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [classSections, setClassSections] = useState([]);
  const [selectedClassSection, setSelectedClassSection] = useState([]);

  useEffect(() => {
    const fetchClassSections = async () => {
      try {
        const data = await getAllClassSections();
        setClassSections(data); // Store the complete data for filtering later

        // Extract unique class names and sections from the data
        const uniqueClasses = Array.from(
          new Set(data.map((item) => item.className))
        ).map((cls) => ({ className: cls }));
        const uniqueSections = Array.from(
          new Set(data.map((item) => item.section_name))
        ).map((sec) => ({ section_name: sec }));

        // Set unique class names and sections
        setClassSections(uniqueClasses);
        setSelectedClassSection(uniqueSections);
      } catch (error) {
        console.error("Failed to fetch class sections:", error);
      }
    };

    fetchClassSections();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.unique_id) {
      setAdmissionNo(userData.unique_id);
    }
  }, []);
  console.log("admission_no:", admission_no);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files,
    }));
  };

  const handleHomeClick = () => navigate("/dashboard");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admission_no) {
      alert("User is not logged in. Please log in first.");
      return;
    }

    if (!formData.certificateurl || formData.certificateurl.length === 0) {
      alert("Please upload a certificate.");
      return;
    }

    // Prepare submission FormData
    const submission = new FormData();
    submission.append("admission_no", admission_no);
    submission.append("title", formData.title);
    submission.append("description", formData.description);
    submission.append("className", selectedClass); // Ensure className is passed
    submission.append("section", selectedSection); // Ensure section is passed
    submission.append("certificateurl", formData.certificateurl[0]);

    // Optional images (multiple)
    if (formData.images) {
      Array.from(formData.images).forEach((img) =>
        submission.append("images", img)
      );
    }

    try {
      await submitAchievement(submission);
      alert("Achievement submitted successfully!");

      // Reset form
      setFormData({
        currentClass: "",
        section: "",
        title: "",
        description: "",
        certificateurl: "",
      });
    } catch (error) {
      console.error("Submission failed:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
        alert(error.response.data.message || "Something went wrong.");
      } else {
        alert("Something went wrong.");
      }
    }
  };

  const handleAddMore = () => {
    if (!formData.currentClass || !formData.section) {
      alert("Please fill in Class and Section before adding more.");
      return;
    }

    if (!formData.certificateurl || formData.certificateurl.length === 0) {
      alert("Please upload a certificate before adding more.");
      return;
    }

    setAchievements([...achievements, formData]);
    setFormData({
      currentClass: "",
      section: "",
      title: "",
      description: "",

      certificateurl: null,
    });

    alert("Achievement added! You can add another.");
  };

  return (
    <div className="achievement-page">
      <div className="main-content">
        <div className="navigation-container">
          <h2 className="nav-title">My Achievement</h2>
          <div className="nav-icons-container">
            <img
              src={homeIcon}
              alt="Home"
              className="nav-icon"
              onClick={handleHomeClick}
            />
            <div className="icon-divider"></div>
            <img
              src={backIcon}
              alt="Back"
              className="nav-icon"
              onClick={handleBackClick}
            />
          </div>
        </div>

        <div className="content">
          <form onSubmit={handleSubmit} className="achievement-form">
            <div
              className="form-row"
              style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
            >
              {/* Current Class */}
              <div className="form-group" style={{ flex: "1 1 20%" }}>
                <label htmlFor="currentClass">
                  Current Class <span className="required">*</span>
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)} // Update class
                >
                  <option value="">Select Class</option>
                  {classSections.map((cls, index) => (
                    <option key={index} value={cls.className}>
                      {cls.className}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div className="form-group" style={{ flex: "1 1 20%" }}>
                <label htmlFor="section">
                  Section <span className="required">*</span>
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)} // Update section
                >
                  <option value="">Select Section</option>
                  {selectedClassSection.map((sec, index) => (
                    <option key={index} value={sec.section_name}>
                      {sec.section_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="form-group" style={{ flex: "1 1 20%" }}>
                <label htmlFor="title">
                  Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Achievement title"
                  required
                />
              </div>

              {/* Images */}
              <div className="form-group" style={{ flex: "1 1 25%" }}>
                <label htmlFor="images">Select Images</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept=".jpg,.jpeg,.png"
                  multiple
                  onChange={handleFileChange}
                />
                <small>Upload photos (JPG, JPEG, PNG formats only).</small>
              </div>

              {/* Certificate */}
              <div className="form-group" style={{ flex: "1 1 25%" }}>
                <label htmlFor="certificateurl">
                  Select Certificate <span className="required">*</span>
                </label>
                <input
                  type="file"
                  id="certificateurl"
                  name="certificateurl"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
                <small>Upload your certificate in PDF format.</small>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add a description"
              ></textarea>
              <small>Provide additional details about your achievement.</small>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Submit
              </button>
              <button
                type="button"
                className="add-more-btn"
                onClick={handleAddMore}
              >
                Add more
              </button>
            </div>
          </form>
          <p className="note">
            <strong>Note:</strong> Fields marked with{" "}
            <span className="required">*</span> are mandatory.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Achievement;

/* CSS */
const styles = `
  .achievement-page {
    flex-direction: column;
    height: 80vh;
    overflow:hidden;
    padding: 0 15px;
  }

  .main-content {
    flex: 1;
    padding: 0 15px;
    background-color: #f9f9f9;
  scrollbar-width: none; 
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none; 
  }

  .navigation-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background:linear-gradient(90deg, #002087, #df0043);
  padding: 22px 20px;
  border-radius: 10px; 
  color: white; /* Text color */
  }
  .nav-icons-container {
  display: flex; /* Ensures icons and divider are in a horizontal row */
  align-items: center; /* Ensures vertical alignment of items */
  gap:10px;
}

 .nav-title {
  font-size: 26px;
  font-weight: 600;
  font-family: "Poppins";
  margin: 0;
}
.nav-icon {
    width: 30px;
    height: 30px;
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

  .content {
    padding: 10px;
    margin-top:10px;
    border-radius: 8px;
  }

  .achievement-form .form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 10px;
    width:100%;
    height:100%;
    
  }

  .form-group {
    flex: 1;
    padding:5px;
  }

  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .form-group textarea {
    resize: vertical;
    min-height: 100px;
  }

  .form-actions {
  margin-top:1opx;
    display: flex;
    gap: 10px;
  }

  .submit-btn {
  background-color: #007bff; /* Blue color */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0056b3; /* Darker blue for hover */
}

.add-more-btn {
  background-color: #dc3545; /* Red color */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.add-more-btn:hover {
  background-color: #a71d2a; /* Darker red for hover */
}
  @media (min-width: 992px) {
  .achievement-form .form-row {
    display: flex;
    flex-wrap: wrap;
  }

  .form-group {
    flex: 1;
  }
}

/* 📱 Tablet View (768px - 991px) */
@media (max-width: 991px) {
 
.main-content {
    max-height: 90vh;
    overflow-y: auto;
    padding: 10px;
    width: 100%;
    margin: 0;
}
  .achievement-form .form-row {
    flex-direction: column;
  }

  .form-group {
    width: 100%;
  }
}

/* 📲 Mobile View (Below 768px) */
@media (max-width: 768px) {

  /* Form becomes one column */
  .achievement-form .form-row {
    flex-direction: column;
    margin-bottom:2px;
  }
  .form-group textarea {
  height:40%;
  }
  .main-content {
    max-height: 90vh;
    overflow-y: auto;
    padding: 10px;
    width: 100%;
    margin: 0;
  }
}
@media (max-width: 425px){
 .content{
  margin:5px;
  }
  .form-group textarea {
  height:100px;
  }
  .main-content {
   width:100%;
    padding: 1px;
  }
}
`;

// Inject CSS
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
