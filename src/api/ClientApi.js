import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://api-school-campus-og-b5c7anguhcdhgxbu.centralindia-01.azurewebsites.net/api',
  headers: {
   
    'Content-Type': 'application/json',
  },
});

// Request Interceptor for attaching token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['o-auth-token'] = `${token}`;  // ✅ using custom header
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
      console.error('Unauthorized access: Token might be expired or missing');
    } else if (error.response?.status === 403) {
      console.error('Forbidden access: You might not have the right permissions');
    } else {
      console.error('API error:', error.response?.data || error.message);
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
  api.put(`/parents/update/${admission_no}`, updatedData).then((res) => res.data);

export const getSchoolInfoById = (id) =>
  api.get(`/school/schoolinfo/${id}`).then((res) => res.data);


export const fetchTeacherById = (emp_id) =>
  api.get(`/teachers/${emp_id}`).then((res) => res.data); 

// Login user (Admin/Teacher/Student)
export const loginUser = (credentials) =>
  api.post('/users/login', credentials).then((res) => res.data);

// Reset password
export const resetPassword = (payload) =>
  api.post('/users/reset-password', payload).then((res) => res.data);

export const getAllSubjects = () =>
  api.get('/subjects/all').then((res) => res.data);

// Get all assignments for a student by admission number
export const getAssignmentsByAdmissionNo = (admission_no) =>
  api.get(`/assignments/all/${admission_no}`).then((res) => res.data);  

export const getAttendanceByAdmissionNo = (admission_no) =>
  api.get(`/attendance/${admission_no}`).then((res) => res.data);  


export const submitAchievement = (formData) =>
  api.post('/students/upload-certificate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Important for file uploads
    },
  }).then((res) => res.data);

  export const fetchAnnouncements = () =>
    api.get('/announcement/getall').then((res) => res.data.Announcements);
  
  
  export const fetchTeacherProfile = (emp_id) =>
    api.get(`/teachers/${emp_id}`).then((res) => res.data);
  

  export const fetchAchievements = async () => 
    api.get('/teachers/certificates').then((res) => res.data.certificates);
  
  export const fetchAcademics = async() =>
    api.get("/academics/list").then((res) => res.data);


  export const bulkUpdateAttendance = async ({ records, emp_id, date }) => {
    console.log(records,emp_id,date);
    const response = await api.post(`/teachers/${emp_id}/upload-attendance`, {
      records,
      emp_id,
      date,
    });
    return response.data;
  };
  export const getStudentsByClassAndSection = async (selectedClass, selectedSection) => {
    const response = await api.get(`/students/list`, {
      params: {
        class: selectedClass,
        section: selectedSection,
      },
    });
    return response.data;
  };
  export const fetchStudents = () =>
    api.get('/students/list').then((res)  => res.data); 
   
export const getAllFees = async () => {
  const response = await api.get("/fee/getfee");
  console.log(response);
  return response.data;
};
  export const submitCertificateRequest = (payload) =>
    api.post('/students/request', payload).then((res) => res.data);

  // Get all certificate requests by admission number
export const getCertificateRequestsByAdmissionNo = (admission_no) =>
  api.get(`/users/certificates/${admission_no}`).then((res) => res.data);

export const submitFeedback = (payload) =>
  api.post('/students/add', payload).then((res) => res.data);

export const uploadTimetable = (timetableData) =>
  api.post('/users/timetable-create', timetableData).then((res) => res.data);

export const getAllClassSections = () =>
  api.get('/classsection/all').then((res) => res.data.data); 

export const submitAssignment = async (emp_id, formData) => {
  return api.post(`/teachers/${emp_id}/assignment`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Ensure this for file uploads
    },
  }).then((res) => res.data);
};

export const getFeesByAdmissionNo = (admission_no) =>
  api.get(`/fee/getbyid/${admission_no}`).then((res) => res.data);

export const  fetchAssignedSubjects=(emp_id)=>
  api.get(`/teachers/assignedSubjects/${emp_id}`).then((res) => res.data);

export const uploadCircular = (formData) => 
  api.post('/teachers/circular', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Important for file uploads
    },
  }).then((res) => res.data);

  export const uploadAcademicsCSV = (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    return api.post('/teachers/upload/academics', formData, {   // ✅ Correct endpoint
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => res.data);
  };
  
  export const assignSubject = (emp_id, assignments, admin_id) => {
    return api.post('/users/assign-subjects', {
      emp_id,
      assignments,
      admin_id,  // optional if backend uses it
    }).then((res) => res.data);
  };
  

  /*export const getAllTeachers = () =>
    api.get('/teachers/all').then((res) => res.data);*/

  export const fetchFilteredSubjects = (filters) =>
    api.get('/users/list/teacher-subject', { params: filters }).then((res) => res.data);

  export const saveSubjects = async (subject_names) => {
    return api.post('/users/subjects', { subject_names }).then((res) => res.data);
  };

  export const createTeacher = async (formData) => {
    return api.post('/teachers/create', formData).then((res) => res.data);
  };
  
 export const createStudent = (formData) =>
  api.post('/students/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => res.data);

  export const createParent = (payload) =>
    api.post('/users/postinfo', payload).then(res => res.data);
  
  export const getAllTeachers = async () => {
  const response = await api.get('/teachers/all'); // your backend endpoint
  return response.data.teachers; // returning only teachers array
};

export const postNotification = async (data, role) => {
  
  return await api.post(
    '/notification/postnot',
    data,
    {
      headers: {
        'Role': role, // sending role to backend for role check
      },
    }
  );
};

export const postAnnouncement = async (announcementData) => {
  try {
    const response = await api.post('/users/add', announcementData);  // adjust the URL if different
    return response.data;
  } catch (error) {
    console.error("Error posting announcement:", error.response?.data || error.message);
    throw error;
  }
};
export const getAllFeedback = () =>
  api.get('/principal/view').then((res) => res.data); 

export const fetchAllNotifications = async (role) => {
  return api
    .get("/notification/getnot", {
      headers: {
        "Role": role // Send role in the request header
      }
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
  return api.post(`/teachers/${emp_id}/students/marks`, payload).then((res) => res.data);
};

export const createUser = ({ role, name, phone_number }) =>
  api.post('/users/create-user', { role, name, phone_number }).then(res => res.data);




export default api;
