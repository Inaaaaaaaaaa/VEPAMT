// Step1.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Step1() {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([
    { id: 1, firstName: '', lastName: '', email: '', country: '', organization: '' },
  ]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newAuthors = [...authors];
    newAuthors[index][name] = value;
    setAuthors(newAuthors);
  };

  const handleAddAuthor = () => {
    const newAuthor = { id: authors.length + 1, firstName: '', lastName: '', email: '', country: '', organization: '' };
    setAuthors([...authors, newAuthor]);
  };

  const handleRemoveAuthor = (index) => {
    const newAuthors = authors.filter((_, i) => i !== index);
    setAuthors(newAuthors);
  };

  const handleNext = () => {
    // 保存作者信息逻辑
    console.log('Authors:', authors);
    navigate('/create-submission/step-2');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Author Information</h2>
      <form>
        {authors.map((author, index) => (
          <div key={author.id} className="mb-6 p-4 border rounded-md">
            <h3 className="text-lg font-bold mb-2">Author {index + 1}</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`firstName-${index}`}>
                First Name
              </label>
              <input
                type="text"
                id={`firstName-${index}`}
                name="firstName"
                value={author.firstName}
                onChange={(e) => handleChange(index, e)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`lastName-${index}`}>
                Last Name
              </label>
              <input
                type="text"
                id={`lastName-${index}`}
                name="lastName"
                value={author.lastName}
                onChange={(e) => handleChange(index, e)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`email-${index}`}>
                Email
              </label>
              <input
                type="email"
                id={`email-${index}`}
                name="email"
                value={author.email}
                onChange={(e) => handleChange(index, e)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`country-${index}`}>
                Country
              </label>
              <input
                type="text"
                id={`country-${index}`}
                name="country"
                value={author.country}
                onChange={(e) => handleChange(index, e)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`organization-${index}`}>
                Organization
              </label>
              <input
                type="text"
                id={`organization-${index}`}
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
