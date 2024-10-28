import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitFiles, finalizeSubmission } from '../../api';

export default function Step3({ submissionID, onSaveFile, localFiles1 }) {
  const navigate = useNavigate();
  const [localFiles, setLocalFiles] = useState(localFiles1 || []);
  const [fname, setFname] = useState(localFiles.length > 0 ? localFiles[0].name : '');
  const [filesSelected, setFilesSelected] = useState(localFiles.length > 0); // Track if files are selected
  const [successMessage, setSuccessMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState(''); // Warning message for no file selection

  const handleFileChange = (e) => {
    const selectedFiles = [...e.target.files];
    if (selectedFiles.length > 0) {
      setLocalFiles(selectedFiles);
      onSaveFile(selectedFiles);
      setFname(selectedFiles[0].name);
      setFilesSelected(true); // Enable submission after selecting files
      setWarningMessage(''); // Clear any previous warnings
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if no files are selected
    if (!filesSelected) {
      setWarningMessage('Please select and upload at least one file before submitting.');
      return;
    }

    try {
      if (submissionID) {
        await submitFiles(submissionID, localFiles); // Send files to backend
        await finalizeSubmission(submissionID); // Finalize the submission
        setSuccessMessage('Successfully submitted!');
        setTimeout(() => {
          navigate('/user/:userID/submission');
        }, 3000);
      } else {
        console.error('Submission ID is missing. Please start from Step 2.');
        alert('Submission ID is missing. Please start from Step 2.');
        navigate('/create-submission/step-2');
      }
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">File Upload</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="files">
            Upload Files {fname}
          </label>
          <input
            type="file"
            id="files"
            name="files"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Display warning message if no files are selected */}
        {warningMessage && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {warningMessage}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            onClick={() => {
              // Check before allowing the submit
              if (!filesSelected) {
                setWarningMessage('Please select and upload at least one file before submitting.');
              }
            }}
            className={`${
              filesSelected ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-500 cursor-not-allowed'
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
          >
            Submit
          </button>
        </div>
      </form>

      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}
    </div>
  );
}