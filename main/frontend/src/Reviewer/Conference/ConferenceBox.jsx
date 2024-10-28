
// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { CalendarIcon, ClockIcon, MapIcon, UserIcon } from '@heroicons/react/20/solid';

// function ConferenceBox({ conference }) {
//   const location = useLocation();

//   // 获取当前 URL 前缀
//   const baseUrl = location.pathname.split('/conference')[0];

//   const calculateRemainingTime = (date) => {
//     const now = new Date();
//     const eventDate = new Date(date);
//     const diff = eventDate - now;
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     return `${days} days remaining`;
//   };

//   return (
//     <div className="flex flex-col p-4 mb-2 border border-gray-300 rounded-md shadow-sm bg-white">
//       {/* 调整链接，保留当前的 URL 前缀 */}
//       <Link to={`${baseUrl}/conference/${conference.conferenceID}`} className="text-blue-500 hover:underline">
//         <h2 className="font-bold text-lg mb-2">{conference.title}</h2>
//       </Link>
//       <div className="flex items-center mb-1">
//         <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
//         <p className="text-sm">{conference.date}</p>
//       </div>
//       <div className="flex items-center mb-1">
//         <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
//         <p className="text-sm">{calculateRemainingTime(conference.date)}</p>
//       </div>
//       <div className="flex items-center mb-1">
//         <MapIcon className="h-5 w-5 text-gray-400 mr-2" />
//         <p className="text-sm">{conference.location}</p>
//       </div>
//       <div className="flex items-center mb-1">
//         <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
//         <p className="text-sm">
//           {conference.participants.length > 0 ? conference.participants.join(', ') : 'No participants'}
//         </p>
//       </div>
//     </div>
//   );
// }

// export default ConferenceBox;
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarIcon, ClockIcon, MapIcon, UserIcon } from '@heroicons/react/20/solid';
import axios from 'axios';

function ConferenceBox({ conference }) {
  const location = useLocation();
  const [participants, setParticipants] = useState([]);

  // 获取当前 URL 前缀
  const baseUrl = location.pathname.split('/conference')[0];

  // 获取参与者信息
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/conferences/${conference.conferenceID}/authors`);
        
        // 提取每个参与者对象的名字（假设有 firstName 和 lastName 属性）
        const participantNames = response.data.map(participant => 
          `${participant.firstName} ${participant.lastName}`
        );
        
        setParticipants(participantNames);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
  }, [conference.conferenceID]);

  const calculateRemainingTime = (date) => {
    const now = new Date();
    const eventDate = new Date(date);
    const diff = eventDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days >= 0 ? `${days} days remaining` : 'Event ended';
  };

  return (
    <div className="flex flex-col p-4 mb-2 border border-gray-300 rounded-md shadow-sm bg-white">
      {/* 调整链接，保留当前的 URL 前缀 */}
      <Link to={`${baseUrl}/conference/${conference.conferenceID}`} className="text-blue-500 hover:underline">
        <h2 className="font-bold text-lg mb-2">{conference.title}</h2>
      </Link>
      <div className="flex items-center mb-1">
        <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
        <p className="text-sm">{conference.date || 'No date provided'}</p>
      </div>
      <div className="flex items-center mb-1">
        <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
        <p className="text-sm">{calculateRemainingTime(conference.date)}</p>
      </div>
      <div className="flex items-center mb-1">
        <MapIcon className="h-5 w-5 text-gray-400 mr-2" />
        <p className="text-sm">{conference.location || 'No location provided'}</p>
      </div>
      <div className="flex items-center mb-1">
        <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
        <p className="text-sm">
          {participants.length > 0 ? participants.join(', ') : 'No participants'}
        </p>
      </div>
    </div>
  );
}

export default ConferenceBox;
