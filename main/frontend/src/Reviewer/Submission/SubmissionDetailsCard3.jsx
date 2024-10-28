import React from 'react';

function SubmissionDetailsCard3({ authors }) {
  return (
    <div className="col-span-1 bg-white p-6 rounded-md shadow-md">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Author Information</h3>
      {authors.map((author, index) => (
        <div key={index} className="mb-4">
          <p className="text-sm text-gray-600"><strong>Name:</strong> {author.name}</p>
          <p className="text-sm text-gray-600">
            <strong>Email:</strong> <a href={`mailto:${author.email}`} className="text-indigo-600 hover:text-indigo-500">{author.email}</a>
          </p>
        </div>
      ))}
    </div>
  );
}

export default SubmissionDetailsCard3;
