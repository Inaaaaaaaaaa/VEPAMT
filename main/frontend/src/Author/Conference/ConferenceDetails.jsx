// ConferenceDetails.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PaperClipIcon, CalendarIcon, ClockIcon, MapIcon, UserIcon } from '@heroicons/react/20/solid';

export default function ConferenceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/conference');
  };

  // 假设这里有从后端获取的数据
  const conference = {
    title: 'AI in Healthcare',
    date: '2024-09-30',
    time: '10:00 AM - 4:00 PM',
    location: 'New York, USA',
    description: 'This conference discusses the applications of AI in the healthcare industryThis conference discusses the applications of AI in the healthcare industry..This conference discusses the applications of AI in the healthcare industry..This conference discusses the applications of AI in the healthcare industry..This conference discusses the applications of AI in the healthcare industry..This conference discusses the applications of AI in the healthcare industry..This conference discusses the applications of AI in the healthcare industry..This conference discusses the applications of AI in the healthcare industry..This conference discusses the applications of AI in the healthcare industry..This conference discusses the applications of AI in the healthcare industry..This conference discusses the applications of AI in the healthcare industry..This conference discusses the applications of AI in the healthcare industry..This conference discusses the applications of AI in the healthcare industry..This conference discusses the applications of AI in the healthcare industry..This conference discusses the applications of AI in the healthcare industry..This conference discusses the applications of AI in the healthcare industry..This conference discusses the applications of AI in the healthcare industry..This conference discusses the applications of AI in the healthcare industry.....',
    participants: ['John Doe', 'Jane Smith'],
    attachments: [
      { name: 'conference_agenda.pdf', size: '1.2mb' },
      { name: 'speaker_list.pdf', size: '800kb' },
    ],
  };

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
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Conference Title</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{conference.title}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Date</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  {conference.date}
                </div>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Time</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                  {conference.time}
                </div>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Location</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex items-center">
                  <MapIcon className="h-5 w-5 text-gray-400 mr-2" />
                  {conference.location}
                </div>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Description</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{conference.description}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Participants</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                  {conference.participants.join(', ')}
                </div>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Attachments</dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                  {conference.attachments.map((attachment, index) => (
                    <li key={index} className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">{attachment.name}</span>
                          <span className="flex-shrink-0 text-gray-400">{attachment.size}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                          Download
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
