import React from 'react';
import { CalendarDaysIcon, TagIcon, UserCircleIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';

export default function SubmissionSummary({ submission }) {
  const { id, paperName, track, status, author, submitDate, keywords } = submission;

  return (
    <div className="w-full p-4 md:w-1/2 lg:w-1/2">
      <h2 className="sr-only">Summary</h2>
      <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
        <dl className="flex flex-wrap">
          <div className="flex-auto pl-6 pt-6">
            <dt className="text-sm font-semibold leading-6 text-gray-900">{paperName}</dt>
            <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">{track}</dd>
          </div>
          <div className="flex-none self-end px-6 pt-4">
            <dt className="sr-only">Status</dt>
            <dd className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ring-1 ring-inset ${
              status === 'Approve' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
              status === 'Pending' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' :
              status === 'Rejected' ? 'bg-red-50 text-red-700 ring-red-600/20' :
              'bg-gray-50 text-gray-700 ring-gray-600/20'
            }`}>
              {status}
            </dd>
          </div>
          <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
            <dt className="flex-none">
              <span className="sr-only">Author</span>
              <UserCircleIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
            </dt>
            <dd className="text-sm font-medium leading-6 text-gray-900">{author}</dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Submit date</span>
              <CalendarDaysIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
            </dt>
            <dd className="text-sm leading-6 text-gray-500">
              <time dateTime={submitDate}>{new Date(submitDate).toLocaleDateString()}</time>
            </dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Keywords</span>
              <TagIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
            </dt>
            <dd className="text-sm leading-6 text-gray-500">{keywords.join(', ')}</dd>
          </div>
        </dl>
        <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
          <Link to={`/submission/${id}`} className="text-sm font-semibold leading-6 text-gray-900">
            View details <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
