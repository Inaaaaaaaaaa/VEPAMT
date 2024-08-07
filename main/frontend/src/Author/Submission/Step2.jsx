// Step2.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Step2() {
  const navigate = useNavigate();
  const [submissionInfo, setSubmissionInfo] = useState({
    paperName: '',
    track: '',
    keywords: '',
    abstract: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubmissionInfo({ ...submissionInfo, [name]: value });
  };

  const handleNext = () => {
    // 保存提交信息逻辑
    navigate('/create-submission/step-3');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Submission Information</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paperName">
            Paper Name
          </label>
          <input
            type="text"
            id="paperName"
            name="paperName"
            value={submissionInfo.paperName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="track">
            Track
          </label>
          <input
            type="text"
            id="track"
            name="track"
            value={submissionInfo.track}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="keywords">
            Keywords
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={submissionInfo.keywords}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="abstract">
            Abstract
          </label>
          <textarea
            id="abstract"
            name="abstract"
            value={submissionInfo.abstract}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="5"
            required
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleNext}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
