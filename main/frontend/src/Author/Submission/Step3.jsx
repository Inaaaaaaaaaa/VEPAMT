// Step3.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Step3() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 处理文件上传逻辑
    console.log('Files uploaded:', files);
    navigate('/submission');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">File Upload</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="files">
            Upload Files
          </label>
          <input
            type="file"
            id="files"
            name="files"
            multiple
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
