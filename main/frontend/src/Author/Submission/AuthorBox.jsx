import React from 'react';

function AuthorBox({ author, authorCount, currentIndex, onNext, onPrevious, onEdit, onAdd, isDraft }) {
  const handleNext = () => {
    if (isDraft && currentIndex < authorCount) {
      onNext();
    } else if (!isDraft && currentIndex < authorCount - 1) {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onPrevious();
    }
  };

  const displayCurrentIndex = isDraft ? currentIndex + 1 : currentIndex;

  return (
    <div className="border p-4 bg-white shadow-md rounded-lg w-1/2 ml-4">
      <h2 className="text-xl font-bold mb-4">Author Info</h2>
      {author ? (
        <>
          <p><strong>Full Name:</strong> {author.firstName} {author.lastName}</p>
          <p><strong>Email:</strong> {author.email}</p>
          <p><strong>Country:</strong> {author.country}</p>
          <p><strong>Organization:</strong> {author.organization}</p>
          {isDraft && (
            <div className="flex justify-end items-center mt-4">
              <button onClick={() => onEdit(author)} className="bg-yellow-500 text-white p-2 rounded">Edit</button>
            </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <button onClick={handlePrevious} className="text-blue-500">{'<'} Previous</button>
            <p>{displayCurrentIndex} of {authorCount + (isDraft ? 1 : 0)}</p>
            <button onClick={handleNext} className="text-blue-500">Next {'>'}</button>
          </div>
        </>
      ) : (
        isDraft ? (
          <div className="flex flex-col items-center justify-center h-full mt-4">
            <button onClick={onAdd} className="bg-green-500 text-white p-6 rounded-full text-2xl mb-4">+</button>
            <p>Add Author</p>
            <div className="flex justify-between items-center mt-4">
              <button onClick={handlePrevious} className="text-blue-500">{'<'} Previous</button>
              <p>{displayCurrentIndex} of {authorCount + 1}</p>
              <button onClick={handleNext} className="text-blue-500">Next {'>'}</button>
            </div>
          </div>
        ) : (
          <p>No author information available.</p>
        )
      )}
    </div>
  );
}

export default AuthorBox;
