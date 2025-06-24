import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor for attaching token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["o-auth-token"] = `${token}`; // ✅ using custom header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Optional: for global error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access: Token might be expired or missing");
    } else if (error.response?.status === 403) {
      console.error(
        "Forbidden access: You might not have the right permissions"
      );
    } else {
      console.error("API error:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// ========== STUDENT API FUNCTIONS ==========

// ✅ Get student by admission number
export const fetchStudentByAdmissionNo = (admission_no) =>
  api.get(`/students/${admission_no}`).then((res) => res.data);

// Get parent info by admission number
export const getParentInfo = (admission_no) =>
  api.get(`/parents/${admission_no}`).then((res) => res.data);

// Update parent info by admission number
export const updateParentInfo = (admission_no, updatedData) =>
  api
    .put(`/parents/update/${admission_no}`, updatedData)
    .then((res) => res.data);

export const getSchoolInfoById = (id) =>
  api.get(`/school/schoolinfo/${id}`).then((res) => res.data);

export const fetchTeacherById = (emp_id) =>
  api.get(`/teachers/${emp_id}`).then((res) => res.data);

// Login user (Admin/Teacher/Student)
export const loginUser = (credentials) =>
  api.post("/users/login", credentials).then((res) => res.data);

// Reset password
export const resetPassword = (payload) =>
  api.post("/users/reset-password", payload).then((res) => res.data);

export const getAllSubjects = () =>
  api.get("/subjects/all").then((res) => res.data);

// Get all assignments for a student by admission number
export const getAssignmentsByAdmissionNo = (admission_no) =>
  api.get(`/assignments/all/${admission_no}`).then((res) => res.data);

export const getAttendanceByAdmissionNo = (admission_no) =>
  api.get(`/attendance/${admission_no}`).then((res) => res.data);

export const submitAchievement = (formData) =>
  api
    .post("/students/upload-certificate", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    })
    .then((res) => res.data);

export const fetchAnnouncements = () =>
  api.get("/announcement/getall").then((res) => res.data.Announcements);

export const fetchTeacherProfile = (emp_id) =>
  api.get(`/teachers/${emp_id}`).then((res) => res.data);

export const fetchAchievements = async () =>
  api.get("/teachers/certificates").then((res) => res.data.certificates);

export const fetchAcademics = async () =>
  api.get("/academics/list").then((res) => res.data);

export const bulkUpdateAttendance = (emp_id, payload, attendance_type) => {
  return api
    .post(`/teachers/${emp_id}/upload-attendance`, {
      ...payload,
      attendance_type,
    })
    .then((res) => res.data);
};

export const getStudentsByClassAndSection = async (className, section = "") => {
  return api
    .get("/students/", {
      params: {
        className,
        section,
      },
    })
    .then((res) => res.data.students); // Extract the array of students
};

export const fetchPrincipalById = (p_id) => {
  return api.get(`/principal/all/${p_id}`).then(res => res.data);
};

export const fetchStudents = () =>
  api.get("/students/list").then((res) => res.data);

export const getAllFees = async () => {
  const response = await api.get("/fee/getfee");
  console.log(response);
  return response.data;
};
export const submitCertificateRequest = (payload) =>
  api.post("/students/request", payload).then((res) => res.data);

// Get all certificate requests by admission number
export const getCertificateRequestsByAdmissionNo = (admission_no) =>
  api.get(`/users/certificates/${admission_no}`).then((res) => res.data);

export const submitFeedback = (payload) =>
  api.post("/students/add", payload).then((res) => res.data);

export const uploadTimetable = (timetableData) =>
  api.post("/users/timetable-create", timetableData).then((res) => res.data);

export const getAllClassSections = () =>
  api.get("/classsection/all").then((res) => res.data.data);

export const submitAssignment = async (emp_id, formData) => {
  return api
    .post(`/teachers/${emp_id}/assignment`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure this for file uploads
      },
    })
    .then((res) => res.data);
};

export const getFeesByAdmissionNo = (admission_no) =>
  api.get(`/fee/getbyid/${admission_no}`).then((res) => res.data);

export const fetchAssignedSubjects = (emp_id) =>
  api.get(`/teachers/assignedSubjects/${emp_id}`).then((res) => res.data);

export const uploadCircular = (formData) =>
  api
    .post("/teachers/circular", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    })
    .then((res) => res.data);

export const uploadAcademicsCSV = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api
    .post("/teachers/upload/academics", formData, {
      // ✅ Correct endpoint
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const assignSubject = (emp_id, assignments, admin_id) => {
  return api
    .post("/users/assign-subjects", {
      emp_id,
      assignments,
      admin_id, // optional if backend uses it
    })
    .then((res) => res.data);
};

/*export const getAllTeachers = () =>
    api.get('/teachers/all').then((res) => res.data);*/

export const fetchFilteredSubjects = (filters) =>
  api
    .get("/users/list/teacher-subject", { params: filters })
    .then((res) => res.data);

export const saveSubjects = async (subject_names) => {
  return api.post("/users/subjects", { subject_names }).then((res) => res.data);
};

export const createTeacher = async (formData) => {
  return api.post("/teachers/create", formData).then((res) => res.data);
};

export const createStudent = (formData) =>
  api
    .post("/students/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

export const createParent = (payload) =>
  api.post("/users/postinfo", payload).then((res) => res.data);

export const getAllTeachers = async () => {
  const response = await api.get("/teachers/all"); // your backend endpoint
  return response.data.teachers; // returning only teachers array
};

export const postNotification = async (data, role) => {
  return await api.post("/notification/postnot", data, {
    headers: {
      Role: role, // sending role to backend for role check
    },
  });
};

export const postAnnouncement = async (announcementData) => {
  try {
    const response = await api.post("/users/add", announcementData); // adjust the URL if different
    return response.data;
  } catch (error) {
    console.error(
      "Error posting announcement:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getAllFeedback = () =>
  api.get("/principal/view").then((res) => res.data);

export const fetchAllNotifications = async (role) => {
  return api
    .get("/notification/getnot", {
      headers: {
        Role: role, // Send role in the request header
      },
    })
    .then((res) => res.data.data);
};

export const addFee = (feeData) => {
  return api.post(`/users/addfee`, feeData);
};

export const fetchCircularsByAdmissionNo = (admission_no) =>
  api.get(`/students/circulars/${admission_no}`).then((res) => res.data);

export const fetchTimetableByAdmissionNo = (admission_no) =>
  api.get(`/timetable/student/${admission_no}`).then((res) => res.data);

export const giveMarks = (emp_id, payload) => {
  return api
    .post(`/teachers/${emp_id}/students/marks`, payload)
    .then((res) => res.data);
};

export const createUser = ({ role, name, phone_number }) =>
  api
    .post("/users/create-user", { role, name, phone_number })
    .then((res) => res.data);

export const downloadAttendanceCSV = async (className, section, date) => {
  return api.get("/principal/class-attendance", {
    params: {
      class: className,
      section,
      date,
      download: true,
    },
    responseType: "blob", // 💾 Important for downloading files
  });
};

export const getClassAttendance = async (className, section, date) => {
  return api
    .get("/principal/class-attendance", {
      params: {
        class: className,
        section,
        date,
      },
    })
    .then((res) => res.data);
};

export const getAttendancePercentage = async (className, section) => {
  return api
    .get("/principal/percentage", {
      params: {
        class: className,
        section: section,
      },
    })
    .then((res) => res.data);
};

export const updateAttendancePercentage = async (admission_no, percentage) => {
  return api
    .put("/update-percentage", {
      admission_no,
      percentage,
    })
    .then((res) => res.data);
};

export const studentUploadAssignment = (admission_no, formData) =>
  api
    .post(`/students/assignment-upload/${admission_no}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

export const applyTeacherLeave = (payload) =>
  api.post("/leaves/apply", payload).then((res) => res.data);

export const fetchAllLeaves = () =>
  api.get("/leaves/all").then((res) => res.data);

// REVIEW (approve/reject) a specific leave
export const reviewLeave = (id, status) =>
  api.put(`/leaves/review/${id}`, { status }).then((res) => res.data);

export const getAllUsers = () => api.get("/users/list").then((res) => res.data);

export const uploadStudyModule = (formData) =>
  api
    .post("/studymodules/modules", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

// Fetch subjects for a specific exam
export const fetchSubjectsByExam = (examName) =>
  api.get(`/studymodules/modules/subjects/${examName}`).then((res) => res.data);

// Fetch topics for a specific exam and subject
export const fetchTopicsByExamAndSubject = (examName, subjectName) =>
  api
    .get(`/studymodules/modules/topics/${examName}/${subjectName}`)
    .then((res) => res.data);

export const fetchPDFUrlById = async (subtitles) => {
  const response = await api.get(`/studymodules/modules/download/${subtitles}`);
  return response.data; // expects { url: "..." }
};
export const fetchPDFUrl = async (subtitles) => {
  const response = await api.get(`/studymodules/modules/view/${subtitles}`);
  return response.data; // expects { url: "..." }
};


export const  fetchSubTopics= (examName, subjectName,topicName) =>
  api
    .get(`/studymodules/modules/topics/${examName}/${subjectName}/${topicName}`)
    .then((res) => res.data);

// Create fee payment order via Razorpay
export const createFeeOrder = async (formData, admissio_no) => {
  const totalAmount =
    Number(formData.tuition_amount || 0) +
    Number(formData.book_amount || 0) +
    Number(formData.transport_amount || 0) +
    Object.values(formData.uniform_details || {}).reduce(
      (a, b) => a + Number(b || 0),
      0
    );

  return api
    .post(`/fee/create-order/${admissio_no}`, {
      ...formData,
      amount: totalAmount,
    })
    .then((res) => res.data);
};

// Verify payment after success
export const verifyFeePayment = async (paymentData) => {
  return api.post("/fee/verify-payment", paymentData).then((res) => res.data);
};

export const sendMessageToClassTeacher = async ({ admission_no, message }) => {
  return api.post('/chat/student/send', { admission_no, message });
};

// ✅ Teacher replies to student
export const teacherReplyToStudent = async ({ emp_id, admission_no, message }) => {
  return api.post('/chat/teacher/reply', { emp_id, admission_no, message });
};

// ✅ Teacher gets inbox (list of student admission numbers)
export const fetchTeacherInbox = async (emp_id) => {
  return api.get(`/chat/inbox/${emp_id}`);
};

// ✅ Fetch messages between student and teacher
export const fetchChatMessages = async (admission_no, emp_id) => {
  return api.get(`/chat/messages/${emp_id}/${admission_no}`);
};

// ✅ Student fetches chat with their class teacher
export const fetchStudentMessages = async (admission_no) => {
  return api.get(`/chat/student/${admission_no}`);
};

export const  promoteStudentsAPI = async (promotionData) => {
  return api
    .post("/promotion/promote", promotionData)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Promotion failed:", err.response?.data || err.message);
      throw err.response?.data || { error: "Unknown promotion error" };
    });
};
// src/api/receipt.js or your central api file
export const generateReceipt = async ({ admission_no, feestype }) => {
  const res = await api.post("/fee/generate-receipt", {
    admission_no,
    feestype,
  });

  console.log("generateReceipt API response:", res.data);

  if (res.data.success) {
    // ✅ Use the full URL directly (no need to prepend origin)
    const receiptUrl = res.data.receiptUrl;
    return receiptUrl;
  } else {
    throw new Error(res.data.message || "Failed to generate receipt.");
  }
};

export const fetchStudentDocumentByAdmissionNo = (admission_no) =>
  api.get(`/studentdocuments/getbyid/${admission_no}`).then((res) => res.data);

export const createStudentDocument = (body) =>
  api.post('/studentdocuments/create', body).then((res) => res.data);

export const updateStudentDocumentByAdmissionNo = (admission_no, body) =>
  api.put(`/studentdocuments/update/${admission_no}`, body).then((res) => res.data);

export const getStudentAssignmentsByTeacher = async (params) => {
  try {
    const response = await api.get("/assignments/view", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching assignments:", error);
    throw error;
  }
};
export const fetchAllStudentDocuments = () =>
  api.get('/studentdocuments/all').then((res) => res.data);
export const getStudentFeeStatus = async (admission_no) => {
  try {
    const response = await api.get(`/fee/student-fee-status/${admission_no}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching fee status:", error);
    throw error;
  }
};

export const createFeePlanForClassSection = async (payload) => {
  try {
    const res = await api.post("/fee/fee-plan", payload);
    return res.data;
  } catch (err) {
    console.error("API Error: createFeePlanForClassSection", err);
    throw err.response?.data || { error: "Server error" };
  }
};

export const getStudentFeeDetails = async (admission_no) => {
  try {
    const response = await api.get(`/fee/student-fee/${admission_no}`);
    return response.data;  // Return data so React page can handle it
  } catch (error) {
    // You can choose to throw error or return error response
    throw error.response ? error.response.data : { error: 'Network error' };
  }
};

export const getFeeStatusByClassSection = async ({ class_name, section_name, feestype }) => {
  try {
    const response = await api.get('/fee/fee-status', {
      params: {
        class_name,
        section_name,
        feestype
      }
    });
    return response.data;
  } catch (error) {
    // Handle and re-throw meaningful error
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { error: "Network or server error" };
    }
  }
};

export const generateMarksheet = async (admission_no, exam_format) => {
  try {
    const response = await api.get(`/academics/marksheet/${admission_no}/${exam_format}`);
    if (response.data.success) {
      return response.data.marksheetUrl;
    }
    return null;
  } catch (err) {
    console.error("generateMarksheet error:", err);
    return null;
  }
};

export const fetchExamFormats = async () => {
  try {
    const res = await api.get("/exam/exam-format");

    // If response is directly an array
    if (Array.isArray(res.data)) {
      return res.data;
    } 

    // In case backend changes in future
    if (res.data.success && res.data.data) {
      return res.data.data;
    }

    console.error("Unexpected API response:", res.data);
    return [];
  } catch (err) {
    if (err.response) {
      console.error("Error response from server:", err.response.status, err.response.data);
    } else if (err.request) {
      console.error("No response received:", err.request);
    } else {
      console.error("Error setting up request:", err.message);
    }
    return [];
  }
};


export const getAllEvents = async (role = "") => {
  const url = role ? `/calendar/events?role=${role}` : "/events";
  const response = await api.get(url);
  return response.data;
};

// Create a single event
export const createEvent = async (eventData) => {
  const response = await api.post("/calendar/events", eventData);
  return response.data;
};

// Create multiple events (bulk create)
export const createBulkEvents = async (events) => {
  const response = await api.post("/calendar/events/bulk", { events });
  return response.data;
};

// Delete an event
export const deleteEvent = async (id) => {
  const response = await api.delete(`/calendar/events/${id}`);
  return response.data;
};

export const getEvent = async () => {
  const response = await api.get("/calendar/get-events");
  return response.data;
};

// Inside component or event handler

export default api;
