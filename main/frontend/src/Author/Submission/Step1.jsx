import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAuthor } from '../../api'; 
import countryList from 'react-select-country-list';

export default function Step1({ onSaveAuthors, authors1, submission }) {
  const navigate = useNavigate();
  const countryOptions = countryList().getData().map(country => country.label); // Get country labels only
  const defaultCountry = "New Zealand";

  const [authors, setAuthors] = useState(
    authors1.length > 0 
      ? authors1 
      : [{ 
          authorID: null, 
          firstName: '', 
          lastName: '', 
          email: '', 
          country: defaultCountry, 
          organization: '', 
          submission: submission?.submisionID ? { "submisionID": submission?.submisionID } : null 
        }]
  );

  const getUserIDFromCookies = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; userID=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const userID = getUserIDFromCookies(); // Retrieve userID from cookies

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setAuthors(prevAuthors => prevAuthors.map((author, i) =>
      i === index ? { ...author, [name]: value } : author
    ));
  };

  const handleCountryChange = (index, e) => {
    const selectedCountry = e.target.value;
    setAuthors(prevAuthors => prevAuthors.map((author, i) =>
      i === index ? { ...author, country: selectedCountry } : author
    ));
  };

  const handleAddAuthor = () => {
    setAuthors([...authors, { 
      authorID: null, 
      firstName: '', 
      lastName: '', 
      email: '', 
      country: defaultCountry, 
      organization: '', 
      submission: submission?.submisionID ? { "submisionID": submission?.submisionID } : null 
    }]);
  };

  const handleRemoveAuthor = (index) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    try {
      const savedAuthors = await Promise.all(authors.map(author => saveAuthor(author)));

      const validAuthors = savedAuthors.filter(author => author && author.authorID);
      if (validAuthors.length === 0) {
        throw new Error('Failed to save authors or missing author IDs');
      }

      onSaveAuthors(validAuthors);
      navigate(`/user/${userID}/create-submission/step-2`);
    } catch (error) {
      console.error('Error saving authors:', error);
      alert('Failed to save authors. Please try again.');
    }
  };

  useEffect(() => {
    setAuthors(prevAuthors => prevAuthors.map(author => ({
      ...author,
      country: author.country || defaultCountry
    })));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Author Information</h2>
      <form>
        {authors.map((author, index) => (
          <div key={index} className="mb-6 p-4 border rounded-md">
            <h3 className="text-lg font-bold mb-2">Author {index + 1}</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={author.firstName}
                onChange={(e) => handleChange(index, e)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={author.lastName}
                onChange={(e) => handleChange(index, e)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={author.email}
                onChange={(e) => handleChange(index, e)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Country</label>
              <select
                name="country"
                value={author.country}
                onChange={(e) => handleCountryChange(index, e)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                {countryOptions.map((country, i) => (
                  <option key={i} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Organization</label>
              <input
                type="text"
                name="organization"
                value={author.organization}
                onChange={(e) => handleChange(index, e)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            {authors.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveAuthor(index)}
                className="text-red-500 hover:text-red-700 text-sm font-bold"
              >
                Remove Author
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAuthor}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
        >
          Add Author
        </button>
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
