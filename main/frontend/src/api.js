import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api", // Backend API base URL
  headers: {
    "Content-Type": "application/json", // Ensure JSON requests are properly handled
  },
});

// Helper function to handle errors
const handleError = (error) => {
  console.error("API call error:", error.response?.data || error.message);
  throw error;
};

/*  --Submission Functions--  */
// Save author data
export const saveAuthor = async (author) => {
  try {
    const response = await apiClient.post("/submissions/author", author);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Finalize a submission
export const finalizeSubmission = async (submissionID) => {
  try {
    const response = await apiClient.post(`/submissions/${submissionID}/finalize`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch a specific submission by ID
export const fetchSubmissionById = async (userID, submissionID) => {
  try {
    const response = await apiClient.get(`/user/${userID}/submission/${submissionID}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};


// Update a submission
export const updateSubmission = async (submission) => {
  try {
    const response = await apiClient.put(`/submissions/${submission.submissionID}`, submission);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Update a submission status
export const updateSubmissionStatus = async (submissionID, newStatus) => {
  try {
    const response = await apiClient.put(`/submissions/${submissionID}/status`, { status: newStatus });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch paginated submissions for a specific user
export const fetchSubmissions = async (userId, page, size) => {
  if (!userId) {
    console.error("User ID is undefined");
    return { submissions: [], totalPages: 1 };
  }

  try {
    const response = await apiClient.get(`/user/${userId}/submissions`, {
      params: { page, size },
    });
    console.log("API Response Data:", response.data); // Log the entire response data
    
    // Check if the response data contains 'content' property
    const submissions = response.data.content || [];
    const totalPages = response.data.totalPages || 1;

    return { submissions, totalPages };
  } catch (error) {
    console.error("Error loading submissions:", error);
    throw error;
  }
};


// Fetch total number of pages for a user’s submissions
export const fetchTotalPages = async (userID, size) => {
  try {
    const response = await apiClient.get(`/user/${userID}/submissions`, {
      params: { page: 0, size },
    });
    return response.data.totalPages;
  } catch (error) {
    handleError(error);
  }
};

// Save a draft submission
export const saveDraftSubmission = async (submissionData) => {
  try {
    const response = await apiClient.post("/submissions/draft", submissionData);
    return response.data;
  } catch (error) {
    console.error("API call error:", error.response?.data || error.message);
    throw error;
  }
};

// Submit a draft submission and change status to 'Pending'
export const submitDraftSubmission = async (submissionID) => {
  try {
    const response = await apiClient.put(`/submissions/${submissionID}/submit`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Update and submit a draft submission
export const putSubmitDraftSubmission = async (submissionData) => {
  submissionData = {
    ...submissionData,
    authors: submissionData.authors || [],  
    files: submissionData.files || [],      
    keywords: submissionData.keywordsAsList || submissionData.keywords,
  };

  try {
    const response = await apiClient.put(`/submissions/${submissionData.submissionID}`, submissionData);
    return response.data;
  } catch (error) {
    console.error('Error in putSubmitDraftSubmission:', error); // Log specific error for debugging
    throw error;
  }
};

// Submit files associated with a submission
export const submitFiles = async (submissionID, files) => {
  const formData = new FormData();
  formData.append("files", files[0], files[0].name);

  try {
    const response = await apiClient.post(`/submissions/${submissionID}/files`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteFile = async (fileID) => {
  try {
    await apiClient.delete(`/files/${fileID}`);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

/*  --Conference Functions--  */
export const fetchConferences = async () => {
  try {
    const response = await apiClient.get("/conferences");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fetch a specific conference by ID
export const fetchConferenceById = async (conferenceID) => {
  try {
    const response = await apiClient.get(`/conferences/${conferenceID}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/*  --Message Functions--  */
export const fetchMessages = async () => {
  try {
    const response = await apiClient.get("/messages");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/*  --Calendar Functions--  */
export const fetchCalendarData = async (year, month) => {
  try {
    const response = await apiClient.get(`/events/${year}/${month}`);
    return response.data;
  } catch (error) {
    handleError(error);
    return { calendarDates: [], events: {} };
  }
};

/*  --Search Functions--  */
export const fetchSearchResults = async (keyword) => {
  try {
    const response = await apiClient.get(`/search/suggestions?query=${encodeURIComponent(keyword)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};
export const fetchConferencesByUser = async (userID) => {
  try {
    
    const response = await fetch(`http://localhost:8080/api/conferences/user/${userID}/relevant`);
    if (!response.ok) {
      throw new Error('Failed to fetch conferences');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching conferences by user:', error);
    return [];
  }
};
