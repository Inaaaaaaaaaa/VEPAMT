import React from 'react';

function SubmissionDetailCard1({ submission }) {
  return (
    <div className="bg-white p-6 rounded-md shadow-md mb-6">
      {/* 显示 Research Paper 的标题 */}
      <h2 className="text-2xl font-semibold mb-2">{submission.title}</h2>

      {/* 显示 Keywords */}
      <p className="text-gray-600 mb-4">
        <strong>Keywords:</strong> {submission.keywords}
      </p>

      {/* 显示 Track */}
      <p className="text-gray-600 mb-4">
        <strong>Track:</strong> {submission.track}
      </p>

      {/* 显示 Abstract */}
      <p className="text-gray-600 mb-4">
        <strong>Abstract:</strong> {submission.abstract}
      </p>

      {/* 显示 Status */}
      <p className="text-gray-600 mb-4">
        <strong>Status:</strong> {submission.status}
      </p>
    </div>
  );
}

export default SubmissionDetailCard1;
