// Import back icon
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/images/home.png"; // Import home icon
import backIcon from "../assets/images/back.png"; // Import back icon

const Academics = () => {
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const [results] = useState([
    { className: "X", assessmentName: "Formative Assessment 1", date: "02/05/2001", resultUrl: "/results/assessment1.pdf" },
    { className: "X", assessmentName: "Formative Assessment 2", date: "02/05/2001", resultUrl: "/results/assessment2.pdf" },
    { className: "X", assessmentName: "Formative Assessment 3", date: "02/05/2001", resultUrl: "/results/assessment3.pdf" },
    { className: "X", assessmentName: "Summative Assessment 1", date: "02/05/2001", resultUrl: "/results/assessment4.pdf" },
    { className: "X", assessmentName: "Summative Assessment 2", date: "02/05/2001", resultUrl: "/results/assessment5.pdf" },
  ]);
 
  const filteredResults =
    filter === "All"
      ? results
      : results.filter((item) => item.assessmentName.includes(filter));

  
  
  const handleHomeClick = () => {
    console.log("Home icon clicked");
    navigate("/dashboard");
  };

  const handleBackClick = () => navigate(-1);

  

 

  return (
    <div className="academics-page">
      <div className="main-layout">
        <div className="main-content">
          <div className="navigation-container">
            <h2 className="nav-title">Academics</h2>
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

          <div className="filter-container">
            <label htmlFor="assessmentFilter">Assessment Type: </label>
            <select
              id="assessmentFilter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Formative">Formative Assessment</option>
              <option value="Summative">Summative Assessment</option>
            </select>
          </div>


          {filteredResults.length > 0 ? (
            <div className="content">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Assessment Name</th>
                    <th>Date</th>
                    <th>View</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result, index) => (
                    <tr key={result.id}>
                      <td>{result.className}</td>
                      <td>{result.assessmentName}</td>
                      <td>{result.date}</td>
                      <td>
                      <span className="view-link" onClick={() => navigate(`/view-result/${result.id}`)}>
                          View
                        </span>
                      </td>
                      <td>
                        <a href={result.resultUrl} download className="download-link">
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-results">No results found for the selected filter.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Academics;

 /* CSS */
 const styles = `
 // @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

   .achievement-page {
     display: flex;
     flex-direction: column;
     height: 100vh;
     overflow:hidden;
   }
 
   .main-layout {
     display: flex;
     flex: 1;
    
   }
 
   .sidebar {
     width: 250px;
     background-color: #f4f4f4;
     border-right: 1px solid #ddd;
   }
 
   .main-content {
     flex: 1;
     padding: 20px;
     background-color: #f9f9f9;
     overflow-y:auto;
     scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
   }
 
   .navigation-container {
     display: flex;
   align-items: center;
   justify-content: space-between;
    background: linear-gradient(90deg, #002087,#002087B0, #DF0043);
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
 
   .content {
     background-color: white;
     padding: 20px;
     margin-top:40px;
     border-radius: 8px;
     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
     overflow: scroll;
   }
 
   .filter-container {
  margin-bottom: 15px;
  margin-top: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-container label {
  
  font-size: 16px;
  font-weight: 500;
}

.filter-container select {
  padding: 5px 10px;
  font-family: 'Poppins', sans-serif;
  border: 1px solid #ccc;
  border-radius: 5px;
}

 
  .results-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 1px;
    overflow: hidden;
    font-family: 'Poppins';
    font-size:16px;
  }

  .results-table th {
    background-color: #002087;
    color: white;
    padding: 12px;
    text-align: center;
    
  }

  .results-table td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    font-size:16px;
    text-align: center;
  }

  .download-link {
    color:rgb(255, 0, 0);
    text-decoration: none;
    font-weight: bold;
  }

  .download-link:hover {
    text-decoration: underline;
  }
    .view-link {
  color: blue; /* Make it look like "Download" */
  cursor: pointer;
  text-decoration: none;
}

.view-link:hover {
  text-decoration: underline;
}

 `;
 
 // Inject CSS
 const styleSheet = document.createElement("style");
 styleSheet.type = "text/css";
 styleSheet.innerText = styles;
 document.head.appendChild(styleSheet);
 