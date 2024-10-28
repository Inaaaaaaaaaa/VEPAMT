import React, { useState, useEffect, Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../App';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function OrganizerLayout() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState("https://australiancentre.com.br/wp-content/uploads/2017/02/AUT-logo-block-international-white.jpg");
  const { setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    // Function to get a cookie value
    function getCookieValue(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }

    // Get userID from cookie
    const userID = getCookieValue('userID');

    // Fetch user data and profile picture if userID is available
    if (userID) {
      fetchUserData(userID);
      fetchProfilePicture(userID);
    }

    // Listen for the custom event 'profilePictureUpdated'
    const handleProfilePictureUpdate = (event) => {
      setProfilePicture(event.detail); // Update the profile picture with the event data
    };

    window.addEventListener('profilePictureUpdated', handleProfilePictureUpdate);

    // Cleanup event listener
    return () => {
      window.removeEventListener('profilePictureUpdated', handleProfilePictureUpdate);
    };
  }, []);

  const fetchUserData = (userID) => {
    fetch(`http://localhost:8080/api/users/${userID}`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        setUsername(data.username);
      })
      .catch((error) => console.error('Error fetching user data:', error));
  };

  const fetchProfilePicture = (userID) => {
    fetch(`http://localhost:8080/api/userProfile/profile-picture?userId=${userID}`)
      .then((response) => response.blob())
      .then((blob) => {
        // If blob size is greater than 0, there's a profile picture; otherwise, keep the default
        if (blob.size > 0) {
          const imageUrl = URL.createObjectURL(blob);
          setProfilePicture(imageUrl);
        }
      })
      .catch((error) => console.error('Error fetching profile picture:', error));
  };

  const handleBellClick = () => {
    navigate('/message');
  };

  const handleSignOut = () => {
    localStorage.removeItem('userID');
    localStorage.removeItem('userType');
    localStorage.setItem('isAuthenticated', 'false');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-blue-100">
      <Sidebar />
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 relative">
            {/* Search form */}
          </div>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500" onClick={handleBellClick}>
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />
            <Menu as="div" className="relative">
              <Menu.Button className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full bg-gray-50 object-cover"
                  src={profilePicture}
                  alt="Profile"
                />
                <span className="hidden lg:flex lg:items-center">
                  <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                    {`Hello ${username}!`}
                  </span>
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
