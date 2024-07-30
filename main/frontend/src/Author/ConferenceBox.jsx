// ConferenceBox.js
import React from 'react';
import { CalendarIcon, ClockIcon,  MapIcon, UserIcon } from '@heroicons/react/20/solid';

function ConferenceBox({ conference }) {
  const calculateRemainingTime = (date) => {
    const now = new Date();
    const eventDate = new Date(date);
    const diff = eventDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days remaining`;
  };

  return (
    <div className="flex flex-col p-4 mb-2 border border-gray-300 rounded-md shadow-sm bg-white">
      <a href="https://www.google.com/" className="text-blue-500 hover:underline">
        <h2 className="font-bold text-lg mb-2">{conference.title}</h2>
      </a>
      <div className="flex items-center mb-1">
        <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
        <p className="text-sm">{conference.date}</p>
      </div>
      <div className="flex items-center mb-1">
        <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
        <p className="text-sm">{calculateRemainingTime(conference.date)}</p>
      </div>
      <div className="flex items-center mb-1">
        < MapIcon className="h-5 w-5 text-gray-400 mr-2" />
        <p className="text-sm">{conference.location}</p>
      </div>
      <div className="flex items-center mb-1">
        <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
        <p className="text-sm">{conference.participants.join(', ')}</p>
      </div>
    </div>
  );
}

export default ConferenceBox;
