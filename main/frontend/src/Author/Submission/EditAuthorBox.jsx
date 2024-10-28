import React, { useState, useEffect } from 'react';
import { saveAuthor } from '../../api'; 
import countryList from 'react-select-country-list';

function EditAuthorBox({ author1, authorCount, currentIndex, onNext, onPrevious, onEdit, onAdd, isDraft, submissionID1, handleOnSaveFile }) {
  author1[currentIndex].submission = { "submissionID": submissionID1 };
  const [author, setAuthor] = useState(author1[currentIndex]);
  const countries = countryList().getData(); // Get the list of countries

  const handleNext = () => {
    if (currentIndex < authorCount - 1) {
      onNext();
    } else if (currentIndex === authorCount - 1) {
      onAdd();
    }
    setAuthor(author1[currentIndex]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newObject = { ...author, [name]: value };
    setAuthor(newObject);
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setAuthor((prevAuthor) => ({ ...prevAuthor, country }));
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onPrevious();
      setAuthor(author1[currentIndex - 1]);
    }
  };

  useEffect(() => {
    setAuthor(author1[currentIndex]);
  }, [author1, currentIndex]);

  const save = async () => {
    try {
      const savedAuthors = await saveAuthor(author);
      console.log('Saved authors:', savedAuthors);
      handleOnSaveFile(savedAuthors);
      alert("Success");
    } catch (error) {
      console.error('Error saving authors:', error);
      alert('Failed to save authors. Please try again.');
    }
  };

  const displayCurrentIndex = currentIndex + 1;

  return (
    <div className="border p-4 bg-white shadow-md rounded-lg w-1/2 ml-4">
      <h2 className="text-xl font-bold mb-4">Author Info</h2>
      {author ? (
        <>
          <p><strong>FirstName:</strong>  <input
            type="text"
            name="firstName"
            value={author.firstName}
            onChange={(e) => handleChange(e)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          /></p>

          <p><strong>LastName:</strong>  <input
            type="text"
            name="lastName"
            value={author.lastName}
            onChange={(e) => handleChange(e)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          /> </p>

          <p><strong>Email:</strong>  <input
            type="text"
            name="email"
            value={author.email}
            onChange={(e) => handleChange(e)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          /> </p>

          <p><strong>Country:</strong>
            <select
              name="country"
              value={author.country || "New Zealand"}
              onChange={handleCountryChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              {countries.map((country) => (
                <option key={country.value} value={country.label}>
                  {country.label}
                </option>
              ))}
            </select>
          </p>

          <p><strong>Organization:</strong>  <input
            type="text"
            name="organization"
            value={author.organization}
            onChange={(e) => handleChange(e)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          /> </p>

          <div className="flex justify-end items-center mt-4">
            <button onClick={save} className="bg-yellow-500 text-white p-2 rounded">Save changes</button>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button 
              onClick={handlePrevious} 
              className="text-blue-500" 
              disabled={currentIndex === 0}
            >
              {'<'} Previous
            </button>
            <p>{displayCurrentIndex} of {authorCount}</p>
            <button 
              onClick={handleNext} 
              className="text-blue-500"
            >
              {currentIndex === authorCount - 1 ? 'Add Author' : 'Next >'}
            </button>
          </div>
        </>
      ) : (
        isDraft ? (
          <div className="flex flex-col items-center justify-center h-full mt-4">
            <button onClick={onAdd} className="bg-green-500 text-white p-6 rounded-full text-2xl mb-4">+</button>
            <p>Add Author</p>
            <div className="flex justify-between items-center mt-4">
              <button onClick={handlePrevious} className="text-blue-500" disabled={currentIndex === 0}>
                {'<'} Previous
              </button>
              <p>{displayCurrentIndex} of {authorCount}</p>
            </div>
          </div>
        ) : (
          <p>No author information available.</p>
        )
      )}
    </div>
  );
}

export default EditAuthorBox;
