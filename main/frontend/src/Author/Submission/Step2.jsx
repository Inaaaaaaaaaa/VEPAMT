import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveDraftSubmission } from "../../api";

export default function Step2({ onSaveSubmission, onSaveAuthor, authors, submi, setSubmissionData1 }) {
  const navigate = useNavigate();
  const [submissionData, setSubmissionData] = useState({
    ...submi,
    track: submi.track || "Track 1",
  });

  // State to store user ID
  const [userId, setUserId] = useState(null);

  // Fetch user ID from localStorage
  useEffect(() => {

    // Helper function to get a value from cookies
    function getCookieValue(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }

    // Get userID and role from cookies
    const storedUserId = getCookieValue('userID');
    console.log('Retrieved userID:', storedUserId);
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID is undefined");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubmissionData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setSubmissionData1((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveDraft = async () => {
    try {
      // 确保 userId 存在于 submissionData 中
      if (!userId) {
        alert("User ID is missing. Please log in again.");
        return;
      }

      const formattedSubmissionData = {
        ...submissionData,
        isDraft: true,
        status: "DRAFT",
        userID: userId, // 确保传递 userID 字段到后端
        keywordsAsList: null,
        authors: authors,
        submitDate: null,
      };

      console.log("Formatted Submission Data:", formattedSubmissionData);

      // 调用 API 保存草稿
      const savedSubmission = await saveDraftSubmission(formattedSubmissionData);
      console.log("Saved Submission:", savedSubmission);

      onSaveSubmission(savedSubmission);

      // 更新作者数据，设置 submission ID
      savedSubmission.authors.forEach(author => {
        author.submission = { submissionID: savedSubmission.submissionID };
      });
      onSaveAuthor(savedSubmission.authors);

      // 跳转到 Step 3
      navigate(`/user/${userId}/create-submission/step-3/${savedSubmission.submissionID}`);
    } catch (error) {
      console.error("Error saving draft submission:", error.response?.data || error.message);
      alert("Failed to save draft submission. Please try again.");
    }
  };


  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Submission Information</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Paper Title</label>
        <input
          type="text"
          name="title"
          value={submissionData.title}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Track</label>
        <select
          name="track"
          value={submissionData.track}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">--Select a Track--</option>
          <option value="Track 1">Track 1</option>
          <option value="Track 2">Track 2</option>
          <option value="Track 3">Track 3</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Keywords</label>
        <input
          type="text"
          name="keywords"
          value={submissionData.keywords}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Abstract</label>
        <textarea
          name="abstractText"
          value={submissionData.abstractText}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="4"
        />
      </div>
      <button
        onClick={handleSaveDraft}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Next
      </button>
    </div>
  );
}
