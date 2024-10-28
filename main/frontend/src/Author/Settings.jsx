import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import countryList from 'react-select-country-list';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

function Settings() {
  const countryOptions = countryList().getData();
  const nzUniversities = [
    "Auckland University of Technology",
    "University of Auckland",
    "University of Otago",
    "Victoria University of Wellington",
    "University of Canterbury",
    "University of Waikato",
    "Lincoln University",
    "Massey University",
  ];

  const defaultProfilePicture = "https://australiancentre.com.br/wp-content/uploads/2017/02/AUT-logo-block-international-white.jpg";
  
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobType: '',
    University: 'Auckland University of Technology', // Default placeholder
    country: 'New Zealand',
    phoneNumber: ''
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(defaultProfilePicture);
  const [newPassword, setNewPassword] = useState('');
  const [isUserProfileExist, setIsUserProfileExist] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = Cookies.get('userID');
      try {
        const profileResponse = await axios.get(`http://localhost:8080/api/userProfile/extended/${userId}`);
        
        if (profileResponse.data) {
          setUserData({
            firstName: profileResponse.data.firstName,
            lastName: profileResponse.data.lastName,
            email: profileResponse.data.email,
            jobType: profileResponse.data.jobTitle || '',
            country: profileResponse.data.country || 'New Zealand',
            University: profileResponse.data.organization || 'Auckland University of Technology',
            phoneNumber: profileResponse.data.phoneNumber || '',
          });
          setIsUserProfileExist(true);
        }

        const pictureResponse = await axios.get(`http://localhost:8080/api/userProfile/profile-picture?userId=${userId}`, {
          responseType: 'arraybuffer',
        });
        const base64Image = btoa(
          new Uint8Array(pictureResponse.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;
        setPreviewImage(imageUrl);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          const userResponse = await axios.get(`http://localhost:8080/api/users/${userId}`);
          setUserData({
            firstName: userResponse.data.firstName,
            lastName: userResponse.data.lastName,
            email: userResponse.data.email,
            jobType: '',
            country: userResponse.data.country || 'New Zealand',
            University: 'Auckland University of Technology',
            phoneNumber: userResponse.data.phoneNumber || '',
          });
          setIsUserProfileExist(false);
        } else {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const userId = Cookies.get('userID');
    
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('firstName', userData.firstName);
    formData.append('lastName', userData.lastName);
    formData.append('email', userData.email);
    formData.append('jobTitle', userData.jobType);
    formData.append('organization', userData.University);
    formData.append('country', userData.country);
    formData.append('phoneNumber', userData.phoneNumber);

    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      if (!isUserProfileExist) {
        await axios.post('http://localhost:8080/api/userProfile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('http://localhost:8080/api/userProfile/update', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (profilePicture) {
        const reader = new FileReader();
        reader.onload = () => {
          window.dispatchEvent(new CustomEvent('profilePictureUpdated', { detail: reader.result }));
        };
        reader.readAsDataURL(profilePicture);
      }

      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const userId = Cookies.get('userID');
    try {
      await axios.post('http://localhost:8080/reset_password', {
        email: userData.email,
        password: newPassword,
      });
      alert('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-blue-100">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">First Name</label>
          <input
            type="text"
            value={userData.firstName}
            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
            placeholder="First Name"
            className="w-full p-2 border rounded h-12"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Last Name</label>
          <input
            type="text"
            value={userData.lastName}
            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
            placeholder="Last Name"
            className="w-full p-2 border rounded h-12"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Email</label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            placeholder="Email"
            className="w-full p-2 border rounded h-12"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Profile Picture</label>
          <div className="mb-2">
            <img
              src={previewImage || defaultProfilePicture}
              alt="User Profile"
              className="w-32 h-32 object-cover rounded-full mb-2"
            />
          </div>
          <input
            type="file"
            onChange={handleProfilePictureChange}
            className="w-full p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Job Type</label>
          <input
            type="text"
            value={userData.jobType}
            onChange={(e) => setUserData({ ...userData, jobType: e.target.value })}
            placeholder="Job Type"
            className="w-full p-2 border rounded h-12"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">University</label>
          <select
            value={userData.University}
            onChange={(e) => setUserData({ ...userData, University: e.target.value })}
            className="w-full p-2 border rounded h-12"
          >
            {nzUniversities.map((university) => (
              <option key={university} value={university}>
                {university}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-2">Country</label>
          <select
            value={userData.country}
            onChange={(e) => setUserData({ ...userData, country: e.target.value })}
            className="w-full p-2 border rounded h-12"
          >
            {countryOptions.map((country) => (
              <option key={country.value} value={country.label}>
                {country.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-2">Phone Number</label>
          <PhoneInput
            placeholder="Enter phone number"
            defaultCountry="NZ"
            value={userData.phoneNumber}
            onChange={(value) => setUserData({ ...userData, phoneNumber: value })}
            className="custom-phone-input w-full p-2 border rounded h-12"
            international={false}
            initialValueFormat="national"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-4">
        <h2 className="text-xl font-bold">Update Password</h2>
        <div>
          <label className="block font-medium mb-2">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full p-2 border rounded h-12"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

export default Settings;
