import React, { useState, useEffect } from "react";
import { submitFiles, deleteFile } from "../../api";

function EditDocumentBox({ files: initialFiles = [], submissionID }) {
  const [files, setFiles] = useState(initialFiles);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setNewFiles(uploadedFiles);
    setSelectedFile(uploadedFiles[0]);
  };

  const handleUpload = async () => {
    if (newFiles.length === 0) return;

    try {
      const updatedSubmission = await submitFiles(submissionID, newFiles);

      if (updatedSubmission && Array.isArray(updatedSubmission.files)) {
        setFiles(updatedSubmission.files); // Update the files state with the latest files array from the updated submission
        alert("Files uploaded successfully!");
      } else {
        console.warn("Uploaded data does not contain a files array:", updatedSubmission);
        alert("Files uploaded, but could not update the file list.");
      }

      setNewFiles([]); // Clear selected files after successful upload
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files.");
    }
  };

  const handleDeleteFile = async (fileID) => {
    try {
      await deleteFile(fileID);

      // Update the files state by filtering out the deleted file
      setFiles(files.filter((file) => file.fileID !== fileID));
      alert("File deleted successfully.");
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete the file.");
    }
  };

  return (
    <div className="document-box border p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Document Box</h2>
      {/* <input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
        multiple
      /> */}
      {/* <button
        onClick={handleUpload}
        className="bg-blue-500 text-white py-1 px-4 rounded mb-4"
      >
        Upload Files
      </button> */}
      <ul className="file-list mb-4">
        {files.map((file) => (
          <li key={file.fileID} className="flex items-center justify-between">
            <a
              href={`http://localhost:8080/api/submissions/files/${file.fileID}/download`}
              className="text-blue-500"
            >
              {file.fileName}
            </a>
            {/* <button
              onClick={() => handleDeleteFile(file.fileID)}
              className="text-red-500"
            >
              Remove
            </button> */}
          </li>
        ))}
      </ul>
      {selectedFile && (
        <div className="selected-file border p-2 bg-gray-100 rounded">
          <h3 className="font-bold">Selected File:</h3>
          <p>{selectedFile.name}</p>
        </div>
      )}
    </div>
  );
}

export default EditDocumentBox;
