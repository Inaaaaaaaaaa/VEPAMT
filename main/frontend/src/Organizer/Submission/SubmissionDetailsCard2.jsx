import React from 'react';
import { PaperClipIcon } from '@heroicons/react/20/solid';

function SubmissionDetailsCard2({ attachments }) {
  return (
    <div className="col-span-3 bg-white p-6 rounded-md shadow-md">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Attachments</h3>
      <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200 overflow-auto max-h-64">
        {attachments.map((attachment, index) => (
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
    </div>
  );
}

export default SubmissionDetailsCard2;
