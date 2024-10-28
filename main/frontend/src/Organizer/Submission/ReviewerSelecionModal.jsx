import React, { useState } from 'react';

function ReviewerSelectionModal({ isOpen, reviewers, onClose, onSave }) {
  const [selectedReviewers, setSelectedReviewers] = useState([]);

  const handleCheckboxChange = (reviewer) => {
    if (selectedReviewers.includes(reviewer)) {
      setSelectedReviewers(selectedReviewers.filter(item => item !== reviewer));
    } else {
      setSelectedReviewers([...selectedReviewers, reviewer]);
    }
  };

  const handleSave = () => {
    onSave(selectedReviewers);
    onClose(); // 关闭模态框
  };

  if (!isOpen) return null; // 如果模态框没有打开，则不渲染内容

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Select Reviewers</h3>
        <div className="space-y-2">
          {reviewers.map((reviewer, index) => (
            <div key={index}>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600"
                  value={reviewer.name}
                  onChange={() => handleCheckboxChange(reviewer)}
                />
                <span className="ml-2">{reviewer.name} ({reviewer.email})</span>
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}

export default ReviewerSelectionModal;
