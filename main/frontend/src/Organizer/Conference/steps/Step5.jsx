import React, { useState } from 'react';

export default function Step5() {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 5: Upload Conference Documents</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Documents</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Selected Files:</h3>
        <ul className="list-disc pl-5">
          {files.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
