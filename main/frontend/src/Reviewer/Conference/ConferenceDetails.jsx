
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { PaperClipIcon, CalendarIcon, ClockIcon, MapIcon, UserIcon } from '@heroicons/react/20/solid';
// import { fetchConferenceById } from '../../api';

// export default function ConferenceDetails() {
//   const { userID, conferenceID } = useParams();
//   const navigate = useNavigate();
//   const [conference, setConference] = useState(null);

//   useEffect(() => {
//     if (!conferenceID) {
//       console.error('Error: Conference ID is undefined');
//       return;
//     }

//     console.log(`Fetching details for conference ID: ${conferenceID}`);

//     fetchConferenceById(conferenceID)
//       .then(data => {
//         if (!data) {
//           console.error('Error: No data received for conference');
//           return;
//         }

//         console.log('Fetched conference data:', data);

//         // 解析 participants 和 attachments 字段
//         const parsedParticipants = Array.isArray(data.participants)
//           ? data.participants
//           : JSON.parse(data.participants || '[]');

//         const parsedAttachments = Array.isArray(data.attachments)
//           ? data.attachments
//           : JSON.parse(data.attachments || '[]');

//         setConference({ ...data, participants: parsedParticipants, attachments: parsedAttachments });
//       })
//       .catch(error => {
//         console.error('Error fetching conference details:', error);
//       });
//   }, [conferenceID]);

//   const handleBack = () => {
//     navigate(`/user/${userID}/conference`);
//   };

//   if (!conference) {
//     console.log('Loading conference data...');
//     return <div>Loading...</div>;
//   }

//   console.log('Rendering conference details:', conference);

//   return (
//     <div className="p-4">
//       <button onClick={handleBack} className="text-blue-500 mb-4">{'< Back'}</button>
//       <div className="bg-white p-6 rounded-md shadow-md">
//         <div className="px-4 sm:px-0">
//           <h3 className="text-base font-semibold leading-7 text-gray-900">Conference Details</h3>
//           <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Detailed information about the conference.</p>
//         </div>
//         <div className="mt-6 border-t border-gray-100">
//           <dl className="divide-y divide-gray-100">
//             {/* 会议标题 */}
//             <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//               <dt className="text-sm font-medium leading-6 text-gray-900">Conference Title</dt>
//               <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                 {conference.title || 'No title provided'}
//               </dd>
//             </div>

//             {/* 日期 */}
//             <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//               <dt className="text-sm font-medium leading-6 text-gray-900">Date</dt>
//               <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                 <div className="flex items-center">
//                   <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
//                   {conference.date || 'No date provided'}
//                 </div>
//               </dd>
//             </div>

//             {/* 时间 */}
//             <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//               <dt className="text-sm font-medium leading-6 text-gray-900">Time</dt>
//               <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                 <div className="flex items-center">
//                   <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
//                   {conference.startTime || 'No time provided'}
//                 </div>
//               </dd>
//             </div>

//             {/* 位置 */}
//             <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//               <dt className="text-sm font-medium leading-6 text-gray-900">Location</dt>
//               <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                 <div className="flex items-center">
//                   <MapIcon className="h-5 w-5 text-gray-400 mr-2" />
//                   {conference.location || 'No location provided'}
//                 </div>
//               </dd>
//             </div>

//             {/* 参与者 */}
//             <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//               <dt className="text-sm font-medium leading-6 text-gray-900">Participants</dt>
//               <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                 <div className="flex items-center">
//                   <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
//                   {conference.participants.length > 0
//                     ? conference.participants.join(', ')
//                     : 'No participants'}
//                 </div>
//               </dd>
//             </div>

//             {/* 会议状态 */}
//             <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//               <dt className="text-sm font-medium leading-6 text-gray-900">Status</dt>
//               <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                 {conference.status || 'No status provided'}
//               </dd>
//             </div>
//           </dl>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PaperClipIcon, CalendarIcon, ClockIcon, MapIcon, UserIcon } from '@heroicons/react/20/solid';
import { fetchConferenceById } from '../../api';
import axios from 'axios';

export default function ConferenceDetails() {
  const { userID, conferenceID } = useParams();
  const navigate = useNavigate();
  const [conference, setConference] = useState(null);
  const [participants, setParticipants] = useState([]);  // 新增：存储参与者的名字

  useEffect(() => {
    if (!conferenceID) {
      console.error('Error: Conference ID is undefined');
      return;
    }

    console.log(`Fetching details for conference ID: ${conferenceID}`);

    // 获取会议详情
    fetchConferenceById(conferenceID)
      .then(data => {
        if (!data) {
          console.error('Error: No data received for conference');
          return;
        }
        console.log('Fetched conference data:', data);
        setConference(data);

        // 获取参与者的名字
        fetchParticipants(conferenceID);
      })
      .catch(error => {
        console.error('Error fetching conference details:', error);
      });
  }, [conferenceID]);

  // 新增：获取参与者名字的函数
  const fetchParticipants = async (conferenceID) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/conferences/${conferenceID}/authors`);
      if (response.data) {
        const authors = response.data.map(author => `${author.firstName} ${author.lastName}`);
        setParticipants(authors);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const handleBack = () => {
    navigate(`/user/${userID}/conference`);
  };

  if (!conference) {
    console.log('Loading conference data...');
    return <div>Loading...</div>;
  }

  console.log('Rendering conference details:', conference);

  return (
    <div className="p-4">
      <button onClick={handleBack} className="text-blue-500 mb-4">{'< Back'}</button>
      <div className="bg-white p-6 rounded-md shadow-md">
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">Conference Details</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Detailed information about the conference.</p>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            {/* 会议标题 */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Conference Title</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {conference.title || 'No title provided'}
              </dd>
            </div>

            {/* 日期 */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Date</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  {conference.date || 'No date provided'}
                </div>
              </dd>
            </div>

            {/* 时间 */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Time</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                  {conference.startTime || 'No time provided'}
                </div>
              </dd>
            </div>

            {/* 位置 */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Location</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex items-center">
                  <MapIcon className="h-5 w-5 text-gray-400 mr-2" />
                  {conference.location || 'No location provided'}
                </div>
              </dd>
            </div>

            {/* 参与者 */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Participants</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                  {participants.length > 0 ? participants.join(', ') : 'No participants'}
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
