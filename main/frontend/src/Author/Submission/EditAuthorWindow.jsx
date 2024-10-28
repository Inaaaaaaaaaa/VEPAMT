import React, { useState } from 'react';

function EditAuthorWindow({ author, onSave, onClose }) {
  const [authorData, setAuthorData] = useState(
    author || { firstName: '', lastName: '', email: '', country: '', organization: '' }
  );

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!authorData.firstName.trim()) errors.firstName = "First Name is required";
    if (!authorData.lastName.trim()) errors.lastName = "Last Name is required";
    if (!authorData.email.trim()) errors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(authorData.email)) errors.email = "Email is invalid";
    if (!authorData.country.trim()) errors.country = "Country is required";
    if (!authorData.organization.trim()) errors.organization = "Organization is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthorData({ ...authorData, [name]: value });
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(authorData);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">{author ? 'Edit Author' : 'Add Author'}</h2>
        <div className="mb-4">
          <label className="block mb-2">First Name:</label>
          <input 
            type="text" 
            name="firstName" 
            value={authorData.firstName} 
            onChange={handleChange} 
            className="border p-2 w-full rounded"
          />
          {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Last Name:</label>
          <input 
            type="text" 
            name="lastName" 
            value={authorData.lastName} 
            onChange={handleChange} 
            className="border p-2 w-full rounded"
          />
          {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email:</label>
          <input 
            type="email" 
            name="email" 
            value={authorData.email} 
            onChange={handleChange} 
            className="border p-2 w-full rounded"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Country:</label>
          <input 
            type="text" 
            name="country" 
            value={authorData.country} 
            onChange={handleChange} 
            className="border p-2 w-full rounded"
          />
          {errors.country && <p className="text-red-500">{errors.country}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Organization:</label>
          <input 
            type="text" 
            name="organization" 
            value={authorData.organization} 
            onChange={handleChange} 
            className="border p-2 w-full rounded"
          />
          {errors.organization && <p className="text-red-500">{errors.organization}</p>}
        </div>
        <div className="flex justify-between">
          <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">Save</button>
          <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditAuthorWindow;
