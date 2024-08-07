import React from 'react';

function StatusBox({ status, track, keywords, abstract, onTrackChange, onKeywordChange, onAbstractChange, onSubmit, onResubmit, review, className }) {
  const boxStyle = `${className} border p-4 bg-white shadow-md rounded-lg flex-grow`;

  if (status === 'draft') {
    return (
      <div className={boxStyle}>
        <h2 className="text-xl font-bold mb-4">Status: Draft</h2>
        <div className="mb-4">
          <label className="block mb-2">Track:</label>
          <select
            value={track}
            onChange={(e) => onTrackChange(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="Track 1">Track 1</option>
            <option value="Track 2">Track 2</option>
            <option value="Track 3">Track 3</option>
            {/* 添加更多的track选项 */}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Keywords:</label>
          <input 
            type="text" 
            value={keywords} 
            onChange={(e) => onKeywordChange(e.target.value)} 
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Abstract:</label>
          <textarea 
            value={abstract} 
            onChange={(e) => onAbstractChange(e.target.value)} 
            className="border p-2 w-full rounded overflow-y-scroll max-h-32" 
            rows="4"
          />
        </div>
        <button onClick={onSubmit} className="bg-blue-500 text-white p-2 rounded">Submit</button>
        <p className="text-red-500 mt-2">Waiting for submit</p>
      </div>
    );
  }

  if (status === 'submitted') {
    return (
      <div className={boxStyle}>
        <h2 className="text-xl font-bold mb-4">Status: Submitted</h2>
        <div className="mb-4">
          <label className="block mb-2">Track:</label>
          <p className="border p-2 bg-gray-100 rounded">{track}</p>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Keywords:</label>
          <p className="border p-2 bg-gray-100 rounded max-h-32 overflow-y-auto">{keywords}</p>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Abstract:</label>
          <p className="border p-2 bg-gray-100 rounded max-h-32 overflow-y-auto">{abstract}</p>
        </div>
        <p className="text-yellow-500 mt-2">Waiting for reviewer assignment</p>
      </div>
    );
  }

  if (status === 'resub') {
    return (
      <div className={boxStyle}>
        <h2 className="text-xl font-bold mb-4">Status: Resubmission Required</h2>
        <div className="mb-4">
          <label className="block mb-2">Track:</label>
          <p className="border p-2 bg-gray-100 rounded">{track}</p>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Review:</label>
          <p className="border p-2 bg-gray-100 rounded max-h-32 overflow-y-auto">{review}</p>
        </div>
        <button onClick={onResubmit} className="bg-blue-500 text-white p-2 rounded">Resubmit</button>
        <p className="text-red-500 mt-2">Please make the necessary changes and resubmit.</p>
      </div>
    );
  }

  if (status === 'reject') {
    return (
      <div className={boxStyle}>
        <h2 className="text-xl font-bold mb-4">Status: Rejected</h2>
        <div className="mb-4">
          <label className="block mb-2">Track:</label>
          <p className="border p-2 bg-gray-100 rounded">{track}</p>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Review:</label>
          <p className="border p-2 bg-gray-100 rounded max-h-32 overflow-y-auto">{review}</p>
        </div>
        <p className="text-red-500 mt-2">Your submission has been rejected.</p>
      </div>
    );
  }

  return null;
}

export default StatusBox;
