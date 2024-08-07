import React, { useState } from 'react';

function DocumentBox() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    setFiles([...files, newFile]);
    setSelectedFile(newFile);
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  return (
    <div className="document-box border p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Document Box</h2>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <ul className="file-list mb-4">
        {files.map((file, index) => (
          <li key={index} onClick={() => handleFileClick(file)} className="cursor-pointer text-blue-500">
            {file.name}
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

export default DocumentBox;
